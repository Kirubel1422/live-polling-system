import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { io, Socket } from "socket.io-client";
import { ENV } from "@/config/env";
import { toast } from "sonner";
import { type SlideResponses } from "@/components/editor/SlideCanvas";
import { useGetSessionDataQuery, useKickParticipantMutation } from "@/api/participant.api";

export function usePreviewHandlers() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId),
  );

  const { data: sessionData } = useGetSessionDataQuery(presentationId || "", { skip: !presentationId });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showPhoneMockup, setShowPhoneMockup] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [slideResponses, setSlideResponses] = useState<SlideResponses>({});
  
  const [kickParticipant] = useKickParticipantMutation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen mode", error);
    }
  };

  const presentationUrl = `${window.location.origin}/start/participant`;

  const participantLastSeen = useRef<Record<string, number>>({});

  useEffect(() => {
    if (sessionData?.participants) {
      setParticipants(sessionData.participants);
      const now = Date.now();
      sessionData.participants.forEach((p: any) => {
        if (!participantLastSeen.current[p.id]) {
          participantLastSeen.current[p.id] = now;
        }
      });
    }
  }, [sessionData]);

  // Socket connection
  useEffect(() => {
    if (!presentationId) return;

    const newSocket = io(ENV.SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("join-presentation", presentationId);

    newSocket.on("participant-joined", (participant: any) => {
      setParticipants((prev) => [...prev, participant]);
      participantLastSeen.current[participant.id] = Date.now();
      toast.success(`${participant.name} joined!`);
    });

    newSocket.on("participant-response", (data: any) => {
      console.log("[Socket.io] Received participant-response in usePreviewHandlers:", data);
      setSlideResponses((prev) => {
        const slideData = prev[data.slideId] || [];
        const nextValue = data.response;
        
        console.log("[Socket.io] Appending value:", nextValue, "for slideId:", data.slideId);
        
        if (slideData.some((r: any) => r.id === nextValue.id)) {
          return prev;
        }

        const updated = {
          ...prev,
          [data.slideId]: [...slideData, nextValue],
        };
        console.log("[Socket.io] Next slideResponses state:", updated);
        return updated;
      });
      toast.info(`New response received!`);
    });

    newSocket.on("participant-response-updated", (data: any) => {
      console.log("[Socket.io] Received participant-response-updated in usePreviewHandlers:", data);
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

    newSocket.on("participant-kicked", (data: any) => {
      const kickedParticipantId = typeof data === 'string' ? data : data.participantId;
      setParticipants((prev) => prev.filter(p => p.id !== kickedParticipantId));
      toast.info(`A participant was kicked.`);
    });

    newSocket.on("participant-ping", (data: { presentationId: string, participantId: string }) => {
      participantLastSeen.current[data.participantId] = Date.now();
      newSocket.emit("presenter-pong", data);
    });

    newSocket.on("participant-alive", (data: { presentationId: string, participantId: string }) => {
      participantLastSeen.current[data.participantId] = Date.now();
    });

    newSocket.on("existing-participants", (participantsData: any[]) => {
      console.log("[Socket.io] Received existing participants in usePreviewHandlers:", participantsData);
      setParticipants(participantsData);
      const now = Date.now();
      participantsData.forEach((p: any) => {
        participantLastSeen.current[p.id] = now;
      });
    });

    const staleCheckInterval = setInterval(() => {
      const now = Date.now();
      setParticipants((prev) => {
        const active = prev.filter((p) => {
          const lastSeen = participantLastSeen.current[p.id];
          if (lastSeen && now - lastSeen > 8000) {
            console.log(`[Socket.io] Removing stale participant ${p.id} due to inactivity`);
            newSocket.emit("remove-participant", p.id);
            toast.info(`${p.name} disconnected`);
            return false;
          }
          return true;
        });
        return active;
      });
    }, 3000);

    newSocket.on("existing-responses", (responses: any[]) => {
      console.log("[Socket.io] Received existing responses in usePreviewHandlers:", responses);
      setSlideResponses((prev) => {
        const updated = { ...prev };
        responses.forEach((resp) => {
          const slideId = resp.slideId;
          const slideData = updated[slideId] || [];
          if (!slideData.some((r: any) => r.id === resp.id)) {
            updated[slideId] = [...slideData, resp];
          }
        });
        console.log("[Socket.io] Populated slideResponses:", updated);
        return updated;
      });
    });

    return () => {
      clearInterval(staleCheckInterval);
      newSocket.disconnect();
    };
  }, [presentationId]);

  // Sync slide change to participants
  useEffect(() => {
    if (socket) {
      socket.emit("presenter-slide-changed", { presentationId, slideIndex: currentSlideIndex });
    }
  }, [currentSlideIndex, socket, presentationId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === "Escape") {
        navigate(`/editor/${presentationId}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, presentation]);

  const currentSlide = presentation?.slides[currentSlideIndex];
  const progress = presentation?.slides.length
    ? ((currentSlideIndex + 1) / presentation.slides.length) * 100
    : 0;

  const goToNextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return {
    presentationId,
    presentation,
    currentSlideIndex,
    setCurrentSlideIndex,
    showPhoneMockup,
    setShowPhoneMockup,
    showQRCode,
    setShowQRCode,
    participants,
    setParticipants,
    slideResponses,
    setSlideResponses,
    presentationUrl,
    currentSlide,
    progress,
    goToNextSlide,
    goToPrevSlide,
    kickParticipant,
    isFullscreen,
    handleToggleFullscreen,
  };
}
