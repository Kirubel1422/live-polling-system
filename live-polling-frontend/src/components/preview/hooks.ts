import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { io, Socket } from "socket.io-client";
import { ENV } from "@/config/env";
import { toast } from "sonner";
import { type SlideResponses } from "@/components/editor/SlideCanvas";

export function usePreviewHandlers() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId),
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showPhoneMockup, setShowPhoneMockup] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [slideResponses, setSlideResponses] = useState<SlideResponses>({});

  const presentationUrl = `${window.location.origin}/start/participant`;

  // Socket connection
  useEffect(() => {
    if (!presentationId) return;

    const newSocket = io(ENV.SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("join-presentation", presentationId);

    newSocket.on("participant-joined", (participant: any) => {
      setParticipantsCount((prev) => prev + 1);
      toast.success(`${participant.name} joined!`);
    });

    newSocket.on("participant-response", (data: any) => {
      console.log("[Socket.io] Received participant-response in usePreviewHandlers:", data);
      setSlideResponses((prev) => {
        const slideData = prev[data.slideId] || [];
        const nextValue = data.response.value;
        
        console.log("[Socket.io] Appending value:", nextValue, "for slideId:", data.slideId);
        
        const updated = {
          ...prev,
          [data.slideId]: [...slideData, nextValue],
        };
        console.log("[Socket.io] Next slideResponses state:", updated);
        return updated;
      });
      toast.info(`New response received!`);
    });

    newSocket.on("existing-responses", (responses: any[]) => {
      console.log("[Socket.io] Received existing responses in usePreviewHandlers:", responses);
      setSlideResponses((prev) => {
        const updated = { ...prev };
        responses.forEach((resp) => {
          const slideId = resp.slideId;
          const slideData = updated[slideId] || [];
          updated[slideId] = [...slideData, resp.value];
        });
        console.log("[Socket.io] Populated slideResponses:", updated);
        return updated;
      });
    });

    return () => {
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
    participantsCount,
    setParticipantsCount,
    slideResponses,
    setSlideResponses,
    presentationUrl,
    currentSlide,
    progress,
    goToNextSlide,
    goToPrevSlide,
  };
}
