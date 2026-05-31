import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSessionDataQuery, useSubmitResponseMutation } from '@/api/participant.api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { ENV } from '@/config/env';

export default function ParticipantPresentation() {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSessionDataQuery(presentationId as string);
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!presentationId) return;

    // Connect to websocket
    const socket = io(ENV.SOCKET_URL, { withCredentials: true });
    
    socket.emit('join-presentation', presentationId);
    
    socket.on('slide-changed', (newIndex: number) => {
      setCurrentSlideIndex(newIndex);
      setAnswer(null); // reset answer when slide changes
    });

    return () => {
      socket.disconnect();
    };
  }, [presentationId]);

  useEffect(() => {
    // If the backend returned initial data, sync index
    if (data?.session) {
      setCurrentSlideIndex(data.session.currentSlideIndex);
    }
  }, [data]);

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

  if (!participantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">You have not joined this session</h2>
        <Button onClick={() => navigate('/start/participant')}>Join Session</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (answer === null || answer === undefined || answer === '') {
      return toast.error("Please provide an answer before submitting.");
    }

    try {
      await submitResponse({
        participantId,
        slideId: slide.id,
        value: answer
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

  const renderContent = () => {
    if (!slide) return <div className="text-center p-8">Waiting for slide...</div>;

    if (hasSubmitted[slide.id]) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="size-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Response Sent!</h3>
          <p className="text-white/70">Wait for the presenter to move to the next slide.</p>
        </div>
      );
    }

    // Removed unused styleObj

    switch (slide.type) {
      case "multiple-choice":
      case "quiz":
      case "image-choice":
        return (
          <div className="flex h-full flex-col p-6 overflow-hidden">
            <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {slide.options?.map((option: any, index: number) => (
                <button
                  key={option.id}
                  onClick={() => setAnswer(option.id)}
                  className={`flex items-center rounded-xl p-4 text-left font-medium transition-all ${answer === option.id ? 'ring-4 ring-white shadow-lg scale-[1.02]' : 'hover:opacity-90'}`}
                  style={{ backgroundColor: option.color || slide.theme.accentColor, color: '#fff' }}
                >
                  <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg">{option.text || `Option ${index + 1}`}</span>
                </button>
              ))}
            </div>
            <Button 
              className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "open-ended":
      case "word-cloud":
      case "qa":
        return (
          <div className="flex h-full flex-col p-6">
            <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex-1">
              <textarea
                className="h-40 w-full rounded-xl border-2 p-4 text-lg focus:outline-none focus:ring-4 transition-all"
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.1)", 
                  borderColor: slide.theme.accentColor + "60", 
                  color: slide.theme.textColor,
                  '--tw-ring-color': slide.theme.accentColor 
                } as any}
                placeholder={slide.meta?.placeholder || "Type your answer..."}
                value={answer || ''}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <Button 
              className="mt-4 w-full h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "rating":
        const ratingMeta = slide.meta || {};
        const ratingType = slide.ratingType || ratingMeta.ratingType || "stars";
        const maxValue = slide.maxValue ?? ratingMeta.maxValue ?? 5;
        const minValue = slide.minValue ?? ratingMeta.minValue ?? 1;

        const emojis = ["😡", "😕", "😐", "🙂", "😊"];

        return (
          <div className="flex h-full flex-col p-6 items-center justify-center text-center">
            <h3 className="mb-10 text-2xl font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            
            {ratingType === "stars" && (
              <div className="flex gap-4 mb-10 flex-wrap justify-center">
                {Array.from({ length: maxValue }).map((_, i) => (
                  <button key={i} onClick={() => setAnswer(i + 1)}>
                    <svg className={`w-12 h-12 transition-all ${answer && answer > i ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 hover:opacity-70'}`} style={{ color: slide.theme.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {ratingType === "emoji" && (
              <div className="flex gap-4 mb-10 flex-wrap justify-center">
                {emojis.slice(0, maxValue).map((emoji, i) => (
                  <button key={i} onClick={() => setAnswer(i + 1)} className={`text-5xl transition-transform ${answer === i + 1 ? 'scale-125 drop-shadow-lg' : 'opacity-50 hover:opacity-100'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {(ratingType === "nps" || (!["stars", "emoji", "slider"].includes(ratingType))) && (
              <div className="flex gap-2 flex-wrap justify-center mb-10">
                {Array.from({ length: (ratingType === "nps" ? 11 : maxValue - minValue + 1) }).map((_, i) => {
                  const val = ratingType === "nps" ? i : minValue + i;
                  return (
                    <button 
                      key={i} 
                      onClick={() => setAnswer(val)}
                      className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${answer === val ? 'ring-2 ring-white scale-110' : 'opacity-80'}`} 
                      style={{ backgroundColor: answer === val ? slide.theme.accentColor : "rgba(255,255,255,0.1)", color: slide.theme.textColor }}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            )}

            <Button 
              className="mt-4 w-full h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "scales":
        const scalesMeta = slide.meta || {};
        const steps = slide.steps ?? scalesMeta.steps ?? 5;
        const scalesLabels = slide.scaleLabels || scalesMeta.scaleLabels;
        const scalesLeftLabel = Array.isArray(scalesLabels) ? scalesLabels[0] : scalesLabels?.left || "Strongly Disagree";
        const scalesRightLabel = Array.isArray(scalesLabels) ? scalesLabels[scalesLabels.length - 1] : scalesLabels?.right || "Strongly Agree";

        return (
          <div className="flex h-full flex-col p-6 items-center justify-center text-center">
            <h3 className="mb-10 text-2xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex justify-between w-full mb-4">
              {Array.from({ length: steps }).map((_, i) => (
                <button
                  key={i}
                  className={`size-12 rounded-full text-sm font-medium transition-all ${answer === i + 1 ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                  style={{
                    backgroundColor:
                      answer === i + 1
                        ? slide.theme.accentColor
                        : "rgba(255,255,255,0.1)",
                    color:
                      answer === i + 1
                        ? "#fff"
                        : slide.theme.textColor,
                  }}
                  onClick={() => setAnswer(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-between w-full mt-4 text-sm font-medium opacity-80">
              <span>{scalesLeftLabel}</span>
              <span>{scalesRightLabel}</span>
            </div>
            <Button 
              className="mt-12 w-full h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "ranking":
      case "100-points":
        const listItems = slide.items || slide.options || [];
        return (
          <div className="flex h-full flex-col p-6">
            <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {listItems.map((item: any, i: number) => (
                <div key={item.id || i} className="flex items-center p-4 rounded-xl border-2" style={{ borderColor: slide.theme.accentColor + "40", backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex-1 text-base font-medium">{item.text || `Item ${i+1}`}</div>
                  {slide.type === "100-points" ? (
                    <input 
                      type="number" 
                      className="w-20 h-10 rounded-lg text-center bg-black/20 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': slide.theme.accentColor } as any}
                      min="0" max="100"
                      value={answer?.[item.id] || ''}
                      onChange={(e) => setAnswer({ ...answer, [item.id]: parseInt(e.target.value) })}
                    />
                  ) : (
                    <input 
                      type="number" 
                      className="w-16 h-10 rounded-lg text-center bg-black/20 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': slide.theme.accentColor } as any}
                      min="1" max={listItems.length}
                      value={answer?.[item.id] || ''}
                      onChange={(e) => setAnswer({ ...answer, [item.id]: parseInt(e.target.value) })}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button 
              className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer || Object.keys(answer).length === 0}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "number":
        return (
          <div className="flex h-full flex-col p-6 items-center justify-center">
            <h3 className="mb-10 text-center text-2xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <input 
              type="number" 
              className="w-full max-w-xs h-20 text-center text-4xl font-bold rounded-2xl bg-black/20 focus:outline-none focus:ring-4"
              style={{ '--tw-ring-color': slide.theme.accentColor } as any}
              placeholder="0"
              value={answer || ''}
              onChange={(e) => setAnswer(Number(e.target.value))}
            />
            <Button 
              className="mt-12 w-full max-w-xs h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || answer === null}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );

      case "content":
      case "heading":
      case "bullet-points":
      case "image":
      case "quote":
        return (
          <div className="flex h-full flex-col p-8 items-center justify-center text-center">
            <h3 className="mb-6 text-3xl font-bold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            {slide.subtitle && <p className="text-xl opacity-80" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />}
            <div className="mt-12 text-sm font-medium opacity-50">Look at the presenter's screen</div>
          </div>
        );

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
