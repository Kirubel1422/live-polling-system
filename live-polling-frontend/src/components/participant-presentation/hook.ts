import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetSessionDataQuery,
  useSubmitResponseMutation,
  useUpvoteResponseMutation,
} from '@/api/participant.api';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { ENV } from '@/config/env';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useParticipantPresentation() {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSessionDataQuery(presentationId as string);
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
  const [upvoteResponse, { isLoading: isUpvoting }] = useUpvoteResponseMutation();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState<Record<string, boolean>>({});
  const [slideResponses, setSlideResponses] = useState<Record<string, any[]>>({});
  const [isKicked, setIsKicked] = useState(false);
  const [isPresenterOffline, setIsPresenterOffline] = useState(false);
  const missedPings = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!presentationId) return;

    // Connect to websocket
    const socket = io(ENV.SOCKET_URL, { withCredentials: true });
    
    socket.on('connect', () => {
      console.log("[Socket.io] Connected, joining room...");
      socket.emit('join-presentation', presentationId);
    });
    
    socket.on('slide-changed', (newIndex: number) => {
      setCurrentSlideIndex(newIndex);
    });

    socket.on("participant-response", (data: any) => {
      setSlideResponses((prev) => {
        const slideData = prev[data.slideId] || [];
        const nextValue = data.response;
        
        if (slideData.some((r: any) => r.id === nextValue.id)) {
          return prev;
        }

        return {
          ...prev,
          [data.slideId]: [...slideData, nextValue],
        };
      });
    });

    socket.on("participant-response-updated", (data: any) => {
      setSlideResponses((prev) => {
        const slideData = prev[data.slideId] || [];
        const updatedData = slideData.map((r: any) => 
          r.id === data.response.id ? data.response : r
        );
        return {
          ...prev,
          [data.slideId]: updatedData,
        };
      });
    });

    socket.on("existing-responses", (responses: any[]) => {
      setSlideResponses((prev) => {
        const updated = { ...prev };
        responses.forEach((resp) => {
          const slideId = resp.slideId;
          const slideData = updated[slideId] || [];
          if (!slideData.some((r: any) => r.id === resp.id)) {
            updated[slideId] = [...slideData, resp];
          }
        });
        return updated;
      });
    });

    socket.on("participant-kicked", (data: any) => {
      console.log("[Socket.io] Received participant-kicked event:", data);
      // Compatibility with previous and new payloads
      const kickedId = typeof data === 'string' ? data : data.participantId;
      const storedId = localStorage.getItem(`participant_${presentationId}`);
      
      console.log(`[Socket.io] kickedId: ${kickedId}, storedId: ${storedId}`);
      
      if (storedId === kickedId) {
        console.log("[Socket.io] Matches! Kicking user...");
        setIsKicked(true);
        localStorage.removeItem(`participant_${presentationId}`);
        toast.error("You have been kicked from the session");
        
        if (typeof data !== 'string' && data.cookieKey && data.cookieValue) {
          // Set cookie to block future joins
          const expiryDate = new Date();
          expiryDate.setTime(expiryDate.getTime() + (60 * 60 * 1000)); // 1 hour
          document.cookie = `${data.cookieKey}=${data.cookieValue}; expires=${expiryDate.toUTCString()}; path=/`;
          console.log("[Socket.io] Block cookie set:", data.cookieKey);
        }
      }
    });

    socket.on("presenter-pong", (data: { presentationId: string, participantId: string }) => {
      const storedId = localStorage.getItem(`participant_${presentationId}`);
      if (data.participantId === storedId) {
        missedPings.current = 0;
        setIsPresenterOffline(false);
      }
    });

    // Beacon ping interval
    const beaconInterval = setInterval(() => {
      const storedId = localStorage.getItem(`participant_${presentationId}`);
      if (storedId) {
        missedPings.current += 1;
        if (missedPings.current >= 3) {
          setIsPresenterOffline(true);
        }
        socket.emit("participant-ping", { presentationId, participantId: storedId });
      }
    }, 5000);

    // Participant alive ping interval
    const aliveInterval = setInterval(() => {
      const storedId = localStorage.getItem(`participant_${presentationId}`);
      if (storedId) {
        socket.emit("participant-alive", { presentationId, participantId: storedId });
      }
    }, 30000);

    return () => {
      clearInterval(beaconInterval);
      clearInterval(aliveInterval);
      socket.disconnect();
    };
  }, [presentationId]);

  useEffect(() => {
    // If the backend returned initial data, sync index
    if (data?.session) {
      setCurrentSlideIndex(data.session.currentSlideIndex);
    }
    
    // Merge existing responses from presentation data
    if (data?.presentation?.slides) {
      setSlideResponses((prev) => {
        const updated = { ...prev };
        data.presentation.slides.forEach((slide: any) => {
          if (slide.responses && slide.responses.length > 0) {
            const slideId = slide.id;
            const slideData = updated[slideId] || [];
            let changed = false;
            
            slide.responses.forEach((resp: any) => {
              if (!slideData.some((r: any) => r.id === resp.id)) {
                slideData.push(resp);
                changed = true;
              }
            });
            
            if (changed) {
              updated[slideId] = [...slideData];
            }
          }
        });
        return updated;
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.presentation) {
      const currentSlide = data.presentation.slides[currentSlideIndex];
      if (currentSlide && currentSlide.type === 'ranking') {
        const listItems = currentSlide.items || currentSlide.options || [];
        setAnswer(listItems.map((item: any) => item.id));
      } else if (currentSlide && currentSlide.type !== 'qa') {
        setAnswer(null);
      }
    }
  }, [currentSlideIndex, data]);

  const handleSubmit = async () => {
    const slide = data?.presentation?.slides[currentSlideIndex];
    if (!slide) return;
    const participantId = localStorage.getItem(`participant_${presentationId}`);
    if (!participantId) {
      return toast.error("You have not joined this session");
    }

    if (answer === null || answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
      return toast.error("Please provide an answer before submitting.");
    }

    if (slide.type === '100-points') {
      const maxPoints = slide.totalPoints || 100;
      let allocatedPoints = 0;
      
      if (typeof answer === 'object' && !Array.isArray(answer) && answer !== null) {
        Object.values(answer).forEach((val: any) => {
          allocatedPoints += Number(val) || 0;
        });
      }

      if (allocatedPoints !== maxPoints) {
        if (allocatedPoints < maxPoints) {
          return toast.error(`Please allocate ${maxPoints - allocatedPoints} more point(s) to reach ${maxPoints}.`);
        } else {
          return toast.error(`You have allocated ${allocatedPoints - maxPoints} point(s) too many. Maximum is ${maxPoints}.`);
        }
      }
    }

    let submitValue = answer;
    if (slide.type === 'ranking' && Array.isArray(answer)) {
      submitValue = answer.reduce((acc: any, id: string, index: number) => {
        acc[id] = index + 1;
        return acc;
      }, {});
    }

    try {
      await submitResponse({
        participantId,
        slideId: slide.id,
        value: submitValue
      }).unwrap();
      
      setHasSubmitted(prev => ({ ...prev, [slide.id]: true }));
      toast.success("Response submitted!");
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || "Failed to submit response";
      if (errorMsg.toLowerCase().includes("already responded")) {
        setHasSubmitted(prev => ({ ...prev, [slide.id]: true }));
        toast.info("You've already submitted an answer for this slide!");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return {
    presentationId,
    navigate,
    data,
    isLoading,
    error,
    submitResponse,
    isSubmitting,
    upvoteResponse,
    isUpvoting,
    currentSlideIndex,
    setCurrentSlideIndex,
    answer,
    setAnswer,
    hasSubmitted,
    setHasSubmitted,
    slideResponses,
    setSlideResponses,
    isKicked,
    setIsKicked,
    isPresenterOffline,
    setIsPresenterOffline,
    sensors,
    handleSubmit,
  };
}
