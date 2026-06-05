import { Loader2 } from 'lucide-react';
import { useParticipantPresentation } from '@/components/participant-presentation/hook';
import { 
  PresenterOfflineView, 
  KickedOutView, 
  NotJoinedView, 
  ResponseSentView, 
  MultipleChoiceSlide, 
  OpenEndedSlide, 
  QASlide, 
  RatingSlide, 
  ScalesSlide, 
  RankingSlide, 
  PointsSlide, 
  NumberSlide, 
  ContentSlide 
} from '@/components/participant-presentation';
import { Button } from '@/components/ui';

export default function ParticipantPresentation() {
  const {
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
    answer,
    setAnswer,
    hasSubmitted,
    slideResponses,
    isKicked,
    isPresenterOffline,
    sensors,
    handleSubmit,
  } = useParticipantPresentation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin size-8" /></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
        <p className="text-muted-foreground mb-6">This presentation might not be live anymore or the link is invalid.</p>
        <Button onClick={() => navigate('/start')}>Back to Start</Button>
      </div>
    );
  }

  const presentation = data.presentation;
  const slide = presentation.slides[currentSlideIndex];
  const participantId = localStorage.getItem(`participant_${presentationId}`);

  if (isPresenterOffline) {
    return <PresenterOfflineView />;
  }

  if (isKicked) {
    return <KickedOutView onBack={() => navigate('/start')} />;
  }

  if (!participantId) {
    return <NotJoinedView onJoin={() => navigate('/start/participant')} />;
  }

  const renderContent = () => {
    if (!slide) return <div className="text-center p-8">Waiting for slide...</div>;

    if (hasSubmitted[slide.id] && slide.type !== "qa") {
      return <ResponseSentView slide={slide} />;
    }

    const commonProps = {
      slide,
      answer,
      setAnswer,
      handleSubmit,
      isSubmitting
    };

    switch (slide.type) {
      case "multiple-choice":
      case "quiz":
      case "image-choice":
        return <MultipleChoiceSlide {...commonProps} />;
      case "open-ended":
      case "word-cloud":
        return <OpenEndedSlide {...commonProps} />;
      case "qa":
        return (
          <QASlide 
            {...commonProps} 
            slideResponses={slideResponses}
            participantId={participantId}
            submitResponse={submitResponse}
            upvoteResponse={upvoteResponse}
            isUpvoting={isUpvoting}
          />
        );
      case "rating":
        return <RatingSlide {...commonProps} />;
      case "scales":
        return <ScalesSlide {...commonProps} />;
      case "ranking":
        return <RankingSlide {...commonProps} sensors={sensors} />;
      case "100-points":
        return <PointsSlide {...commonProps} />;
      case "number":
        return <NumberSlide {...commonProps} />;
      case "content":
      case "heading":
      case "bullet-points":
      case "image":
      case "quote":
        return <ContentSlide slide={slide} />;
      default:
        return <div className="p-8 text-center">Slide type not supported in participant view yet.</div>;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{
      backgroundColor: slide?.theme?.backgroundColor || "#131f2b",
      color: slide?.theme?.textColor || "#ffffff",
      fontFamily: slide?.theme?.fontFamily || "Inter, sans-serif"
    }}>
      {renderContent()}
    </div>
  );
}
