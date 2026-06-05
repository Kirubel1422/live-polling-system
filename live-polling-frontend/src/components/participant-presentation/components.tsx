import React from 'react';
import { Button } from '@/components/ui/button';
import { getContrastColor } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, ThumbsUp, WifiOff } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SlideComponentProps {
  slide: any;
  answer: any;
  setAnswer: any;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export interface QASlideProps extends SlideComponentProps {
  slideResponses: any;
  participantId: string;
  submitResponse: any;
  upvoteResponse: any;
  isUpvoting: boolean;
}

export interface RankingSlideProps extends SlideComponentProps {
  sensors: any;
}

export function PresenterOfflineView() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-[#33C3FF]/16 blur-3xl dark:bg-[#33C3FF]/10" />

      <div className="fade-up relative z-10 w-full max-w-md rounded-2xl bg-white/[0.88] px-8 py-9 text-center backdrop-blur-xl dark:bg-white/[0.06]">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary/10">
          <WifiOff className="size-10 text-primary" />
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/70 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary dark:border-white/10 dark:bg-white/[0.04]">
          <span className="size-2 rounded-full bg-primary/70 animate-pulse" />
          Reconnecting
        </div>

        <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
          Waiting for presenter
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          The presenter seems to be offline or having connection issues. Please hold
          tight — we'll reconnect automatically as soon as they return.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50/70 px-4 py-4 dark:bg-white/[0.04]">
          <div className="flex items-center justify-center gap-2">
            <span
              className="size-2.5 rounded-full bg-primary/70 animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="size-2.5 rounded-full bg-primary/70 animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="size-2.5 rounded-full bg-primary/70 animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Checking presenter connection...
          </p>
        </div>
      </div>
    </div>
  );
}

export function KickedOutView({ onBack }: { onBack: () => void }) {
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
      <Button size="lg" onClick={onBack}>Back to Start</Button>
    </div>
  );
}

export function NotJoinedView({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">You have not joined this session</h2>
      <Button onClick={onJoin}>Join Session</Button>
    </div>
  );
}

export function ResponseSentView({ slide }: { slide: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="size-16 rounded-full flex items-center justify-center mb-4 border-2" style={{ backgroundColor: `${slide.theme?.accentColor || '#3b82f6'}15`, borderColor: `${slide.theme?.accentColor || '#3b82f6'}40` }}>
        <svg className="size-8" style={{ color: slide.theme?.accentColor || '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: slide.theme?.textColor || '#ffffff' }}>Response Sent!</h3>
      <p className="opacity-70" style={{ color: slide.theme?.textColor || '#ffffff' }}>Wait for the presenter to move to the next slide.</p>
    </div>
  );
}

export function MultipleChoiceSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <div className="flex w-full px-2 pt-2 flex-col gap-3 overflow-y-auto pb-4 max-h-[60vh]">
        {slide.options?.map((option: any, index: number) => (
          <button
            key={option.id}
            onClick={() => setAnswer(option.id)}
            className={`flex items-center rounded-xl p-4 text-left font-medium transition-all border-2 ${answer === option.id ? 'ring-4 ring-white shadow-lg scale-[1.02]' : 'hover:opacity-90'}`}
            style={{ 
              backgroundColor: option.color || slide.theme.accentColor, 
              color: getContrastColor(option.color || slide.theme.accentColor),
              borderColor: `${slide.theme.textColor}20`
            }}
          >
            <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full text-sm" style={{ backgroundColor: getContrastColor(option.color || slide.theme.accentColor) === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-lg" dangerouslySetInnerHTML={{__html: option.text || `Option ${index + 1}`}}/>
          </button>
        ))}
      </div>
      <button 
        className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: answer 
            ? (slide.options?.find((o: any) => o.id === answer)?.color || slide.theme.accentColor) 
            : "#ffffff", 
          color: answer 
            ? getContrastColor(slide.options?.find((o: any) => o.id === answer)?.color || slide.theme.accentColor) 
            : "rgba(0,0,0,0.4)",
          borderColor: slide.theme.textColor + "30"
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || !answer}
      >
        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
        {isSubmitting ? "" : "Submit"}
      </button>
    </div>
  );
}

export function OpenEndedSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-6 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <div className="w-full">
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
      <button 
        className="mt-4 w-full h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: (answer && String(answer).trim() !== "") ? slide.theme.accentColor : "#ffffff", 
          color: (answer && String(answer).trim() !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || !answer || String(answer).trim() === ""}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function QASlide({ slide, answer, setAnswer, isSubmitting, slideResponses, participantId, submitResponse, upvoteResponse, isUpvoting }: QASlideProps) {
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

  const uniqueQuestions = Array.from(new Map(liveQuestions.map((q: any) => [q.id || q.text, q])).values());
  uniqueQuestions.sort((a: any, b: any) => b.upvotes - a.upvotes);

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
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-4 text-center text-xl font-semibold leading-tight shrink-0" dangerouslySetInnerHTML={{ __html: slide.title }} />
      
      {/* Ask Question Form */}
      <div className="flex gap-2 mb-6 shrink-0">
        <input
          type="text"
          className="flex-1 h-12 rounded-xl border-2 px-4 focus:outline-none focus:ring-2 transition-all bg-neutral-50 text-black"
          style={{ borderColor: slide.theme.accentColor + "60", '--tw-ring-color': slide.theme.accentColor } as any}
          placeholder="Ask a question..."
          value={typeof answer === 'string' ? answer : ''}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAskQuestion();
          }}
        />
        <button
          className="h-12 px-6 rounded-xl font-bold border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          style={{ 
            backgroundColor: (answer && String(answer).trim() !== "") ? slide.theme.accentColor : "#ffffff", 
            color: (answer && String(answer).trim() !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
            borderColor: `${slide.theme.textColor}20`
          }}
          onClick={handleAskQuestion}
          disabled={isSubmitting || !answer || !String(answer).trim()}
        >
          Send
        </button>
      </div>

      {/* List of existing questions */}
      <div className="w-full flex flex-col gap-3 overflow-y-auto pb-4 max-h-[50vh]">
        {uniqueQuestions.length === 0 ? (
          <p className="text-center text-muted-foreground my-8">No questions asked yet. Be the first!</p>
        ) : (
          uniqueQuestions.map((q: any) => {
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

export function RatingSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
  const ratingMeta = slide.meta || {};
  const ratingType = slide.ratingType || ratingMeta.ratingType || "stars";
  const maxValue = slide.maxValue ?? ratingMeta.maxValue ?? 5;
  const minValue = slide.minValue ?? ratingMeta.minValue ?? 1;

  const emojis = ["😡", "😕", "😐", "🙂", "😊"];

  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
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

      <button 
        className="mt-4 w-full h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: answer ? slide.theme.accentColor : "#ffffff", 
          color: answer ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || !answer}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function ScalesSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
  const scalesMeta = slide.meta || {};
  const steps = slide.steps ?? scalesMeta.steps ?? 5;
  const scalesLabels = slide.scaleLabels || scalesMeta.scaleLabels;
  const scalesLeftLabel = Array.isArray(scalesLabels) ? scalesLabels[0] : scalesLabels?.left || "Strongly Disagree";
  const scalesRightLabel = Array.isArray(scalesLabels) ? scalesLabels[scalesLabels.length - 1] : scalesLabels?.right || "Strongly Agree";

  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
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
                  ? getContrastColor(slide.theme.accentColor)
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
      <button 
        className="mt-12 w-full h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: slide.theme.accentColor, 
          color: getContrastColor(slide.theme.accentColor),
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function SortableRankingItem({ id, children, color }: { id: string; children: React.ReactNode; color: string }) {
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

export function RankingSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting, sensors }: RankingSlideProps) {
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
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-2 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <p className="mb-6 text-center text-sm font-medium opacity-70">Drag and drop to rank items</p>
      <div className="flex w-full flex-col gap-3 overflow-y-auto pb-4 max-h-[60vh]">
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
      <button 
        className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: (answer && Array.isArray(answer) && answer.length > 0) ? slide.theme.accentColor : "#ffffff", 
          color: (answer && Array.isArray(answer) && answer.length > 0) ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || !answer || (Array.isArray(answer) && answer.length === 0)}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function PointsSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
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
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-2 text-center text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <div className="mb-6 text-center font-medium" style={{ color: remainingPoints === 0 ? '#10b981' : remainingPoints < 0 ? '#ef4444' : slide.theme.textColor }}>
        {remainingPoints === 0 ? "All points allocated!" : remainingPoints > 0 ? `${remainingPoints} points remaining` : `${Math.abs(remainingPoints)} points over limit`}
      </div>
      <div className="flex w-full flex-col gap-3 overflow-y-auto pb-4 max-h-[60vh]">
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
      <button 
        className="mt-2 w-full shrink-0 h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: (answer && Object.keys(answer).length > 0) ? slide.theme.accentColor : "#ffffff", 
          color: (answer && Object.keys(answer).length > 0) ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || !answer || Object.keys(answer).length === 0}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function NumberSlide({ slide, answer, setAnswer, handleSubmit, isSubmitting }: SlideComponentProps) {
  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6">
      <h3 className="mb-10 text-center text-2xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <input 
        type="number" 
        className="w-full max-w-xs mx-auto h-20 text-center text-4xl font-bold rounded-2xl light:bg-neutral-50 focus:outline-none focus:ring-4"
        style={{ '--tw-ring-color': slide.theme.accentColor, color: "black" } as any}
        placeholder="0"
        value={answer || ''}
        onChange={(e) => setAnswer(Number(e.target.value))}
      />
      <button 
        className="mt-12 w-full max-w-xs mx-auto h-14 text-lg font-bold rounded-xl border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{ 
          backgroundColor: (answer !== null && answer !== undefined && answer !== "") ? slide.theme.accentColor : "#ffffff", 
          color: (answer !== null && answer !== undefined && answer !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
          borderColor: `${slide.theme.textColor}20`
        }}
        onClick={handleSubmit}
        disabled={isSubmitting || answer === null || answer === undefined || answer === ""}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </div>
  );
}

export function ContentSlide({ slide }: { slide: any }) {
  return (
    <div className="flex md:max-w-md lg:max-w-xl mx-auto h-full flex-col justify-center p-6 text-center">
      <h3 className="mb-6 text-3xl font-bold" dangerouslySetInnerHTML={{ __html: slide.title }} />
      {slide.subtitle && <p className="text-xl opacity-80" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />}
      <div className="mt-12 text-sm font-medium opacity-50">Look at the presenter's screen</div>
    </div>
  );
}