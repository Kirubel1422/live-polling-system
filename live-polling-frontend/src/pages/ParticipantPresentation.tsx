import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ThumbsUp, WifiOff } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useParticipantPresentation } from '@/components/participant-presentation/hook';
import { CSS } from '@dnd-kit/utilities';

function SortableRankingItem({ id, children, color }: { id: string; children: React.ReactNode; color: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderColor: color + "40",
    backgroundColor: "rgba(255,255,255,0.05)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-4 rounded-xl border-2 touch-none cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
    >
      {children}
    </div>
  );
}

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#1a1a2e]">
        <div className="size-24 rounded-full bg-[#0598CE]/10 flex items-center justify-center mb-6 animate-pulse">
          <WifiOff className="size-12 text-[#0598CE]/70" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Waiting for Presenter</h2>
        <p className="text-lg text-white/70 max-w-md">
          The presenter seems to be offline or experiencing connection issues. Please hold tight, we'll reconnect automatically as soon as they return.
        </p>
        <div className="mt-8 flex gap-2 justify-center">
          <span className="size-2 rounded-full bg-[#0598CE]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="size-2 rounded-full bg-[#0598CE]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="size-2 rounded-full bg-[#0598CE]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (isKicked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#1a1a2e]">
        <div className="size-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
          <svg className="size-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">You've been kicked out</h2>
        <p className="text-lg text-white/70 mb-8 max-w-md">
          The presenter has removed you from this live presentation session.
        </p>
        <Button size="lg" onClick={() => navigate('/start')}>Back to Start</Button>
      </div>
    );
  }

  if (!participantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">You have not joined this session</h2>
        <Button onClick={() => navigate('/start/participant')}>Join Session</Button>
      </div>
    );
  }


  const renderContent = () => {
    if (!slide) return <div className="text-center p-8">Waiting for slide...</div>;

    if (hasSubmitted[slide.id] && slide.type !== "qa") {
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
          <div className="flex h-full md:max-w-md lg:max-w-xl mx-auto flex-col p-6 overflow-hidden">
            <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex flex-1 px-2 pt-2 flex-col gap-3 overflow-y-auto pb-4">
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
                  <span className="text-lg" dangerouslySetInnerHTML={{__html: option.text || `Option ${index + 1}`}}/>
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
        return (
          <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col p-6">
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

      case "qa": {
        const responsesList = slideResponses[slide.id] || [];
        
        const liveQuestions = responsesList.map((r: any, idx: number) => {
          if (typeof r === 'string') {
            return { id: r, text: r, upvotes: 0, upvotedBy: [] };
          }
          const val = r.value || {};
          return {
            id: r.id || `fallback-${idx}`,
            text: typeof val === 'string' ? val : (val.text || ""),
            upvotes: typeof val === 'object' ? (val.upvotes || 0) : 0,
            upvotedBy: typeof val === 'object' ? (val.upvotedBy || []) : []
          };
        });

        // Deduplicate in case there are still undefined ID copies or string duplicates
        const uniqueQuestions = Array.from(new Map(liveQuestions.map((q) => [q.id || q.text, q])).values());

        // Sort questions by upvotes descending
        uniqueQuestions.sort((a, b) => b.upvotes - a.upvotes);

        const handleAskQuestion = async () => {
          if (!answer || !answer.trim()) return;
          try {
            await submitResponse({
              participantId,
              slideId: slide.id,
              value: answer.trim()
            }).unwrap();
            setAnswer('');
            toast.success("Question submitted!");
          } catch (err: any) {
            const errorMsg = err.data?.message || err.message || "Failed to submit question";
            toast.error(errorMsg);
          }
        };

        const handleUpvote = async (responseId: string) => {
          try {
            await upvoteResponse({
              participantId: participantId as string,
              responseId
            }).unwrap();
            toast.success("Upvoted!");
          } catch (err: any) {
            const errorMsg = err.data?.message || err.message || "Failed to upvote question";
            toast.error(errorMsg);
          }
        };

        return (
          <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col p-6 overflow-hidden">
            <h3 className="mb-4 text-center text-xl font-semibold leading-tight shrink-0" dangerouslySetInnerHTML={{ __html: slide.title }} />
            
            {/* Ask Question Form */}
            <div className="flex gap-2 mb-6 shrink-0">
              <input
                type="text"
                className="flex-1 h-12 rounded-xl border-2 px-4 focus:outline-none focus:ring-2 transition-all bg-black/25 text-white"
                style={{ borderColor: slide.theme.accentColor + "60", '--tw-ring-color': slide.theme.accentColor } as any}
                placeholder="Ask a question..."
                value={typeof answer === 'string' ? answer : ''}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion();
                }}
              />
              <Button
                className="h-12 px-6 rounded-xl font-bold"
                style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
                onClick={handleAskQuestion}
                disabled={isSubmitting || !answer || !String(answer).trim()}
              >
                Send
              </Button>
            </div>

            {/* List of existing questions */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pb-4">
              {uniqueQuestions.length === 0 ? (
                <p className="text-center text-muted-foreground my-8">No questions asked yet. Be the first!</p>
              ) : (
                uniqueQuestions.map((q) => {
                  const hasAlreadyUpvoted = q.upvotedBy.includes(participantId);
                  return (
                    <div
                      key={q.id}
                      className="flex items-center gap-3 rounded-xl p-4 border border-white/10"
                      style={{ backgroundColor: slide.theme.textColor + "08" }}
                    >
                      <div 
                        className="flex-1 font-medium" 
                        style={{ color: slide.theme.textColor }} 
                        dangerouslySetInnerHTML={{ __html: q.text }} 
                      />
                      <button
                        onClick={() => handleUpvote(q.id)}
                        disabled={isUpvoting || hasAlreadyUpvoted}
                        className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-xs font-semibold shrink-0 ${hasAlreadyUpvoted ? 'bg-white/20 opacity-80 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'}`}
                        style={{ color: slide.theme.accentColor }}
                      >
                        <ThumbsUp className={`size-4 ${hasAlreadyUpvoted ? 'fill-current' : ''}`} />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      }

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
          <div className="flex h-full md:max-w-md lg:max-w-xl mx-auto flex-col p-6 items-center justify-center text-center">
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
              <span dangerouslySetInnerHTML={{ __html: scalesLeftLabel }} />
              <span dangerouslySetInnerHTML={{ __html: scalesRightLabel }} />
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

      case "ranking": {
        const listItems = slide.items || slide.options || [];
        const orderedItems = (Array.isArray(answer) ? answer : listItems.map((i: any) => i.id))
          .map((id: string) => listItems.find((i: any) => i.id === id))
          .filter(Boolean);

        const handleDragEnd = (event: DragEndEvent) => {
          const { active, over } = event;
          if (over && active.id !== over.id) {
            setAnswer((items: string[]) => {
              const oldIndex = items.indexOf(active.id as string);
              const newIndex = items.indexOf(over.id as string);
              return arrayMove(items, oldIndex, newIndex);
            });
          }
        };

        return (
          <div className="flex h-full flex-col p-6">
            <h3 className="mb-2 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <p className="mb-6 text-center text-sm font-medium opacity-70">Drag and drop to rank items</p>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedItems.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                  {orderedItems.map((item: any, index: number) => (
                    <SortableRankingItem key={item.id} id={item.id} color={slide.theme.accentColor}>
                      <span className="mr-4 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold bg-black/20">
                        {index + 1}
                      </span>
                      <div className="flex-1 text-base font-medium" dangerouslySetInnerHTML={{ __html: item.text || `Item ${index+1}` }} />
                      <div className="opacity-50">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                    </SortableRankingItem>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
            <Button 
              className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl" 
              style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer || (Array.isArray(answer) && answer.length === 0)}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        );
      }

      case "100-points": {
        const pointsListItems = slide.items || slide.options || [];
        const maxPoints = slide.totalPoints || 100;
        
        let allocatedPoints = 0;
        if (typeof answer === 'object' && answer !== null && !Array.isArray(answer)) {
          Object.values(answer).forEach((val: any) => {
            allocatedPoints += Number(val) || 0;
          });
        }
        const remainingPoints = maxPoints - allocatedPoints;

        return (
          <div className="flex h-full md:max-w-md lg:max-w-xl mx-auto flex-col p-6">
            <h3 className="mb-2 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="mb-6 text-center font-medium" style={{ color: remainingPoints === 0 ? '#10b981' : remainingPoints < 0 ? '#ef4444' : slide.theme.textColor }}>
              {remainingPoints === 0 ? "All points allocated!" : remainingPoints > 0 ? `${remainingPoints} points remaining` : `${Math.abs(remainingPoints)} points over limit`}
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {pointsListItems.map((item: any, i: number) => (
                <div key={item.id || i} className="flex items-center p-4 rounded-xl border-2" style={{ borderColor: slide.theme.accentColor + "40", backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex-1 text-base font-medium" dangerouslySetInnerHTML={{ __html: item.text || `Item ${i+1}` }} />
                  <input 
                    type="number" 
                    className="w-20 h-10 rounded-lg text-center bg-black/20 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': slide.theme.accentColor } as any}
                    min="0" max="100"
                    value={answer?.[item.id] ?? ''}
                    onChange={(e) => setAnswer({ ...answer, [item.id]: e.target.value === '' ? '' : parseInt(e.target.value) })}
                  />
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
      }

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
