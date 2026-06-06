import { useState, useEffect } from "react";
import { getContrastColor } from "@/lib/utils";
import type { Slide } from "@/types/presentation";
import { renderSlideContent } from "@/components/editor/SlideCanvas";

export function SlideRenderer({
  slide,
  responses,
}: {
  slide: Slide;
  responses: any[];
}) {
  const processedResponses =
    slide.type === "qa"
      ? responses
      : responses.map((response: any) =>
          response && typeof response === "object" && "value" in response
            ? response.value
            : response,
        );

  return (
    <>
      {renderSlideContent(slide, false, undefined, true, processedResponses)}
    </>
  );
}

export function PhoneSlideView({
  slide,
  onSubmit,
}: {
  slide: Slide;
  onSubmit?: (val: any) => void;
}) {
  const [answer, setAnswer] = useState<any>(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSubmitted(false);
    if (slide.type === "ranking") {
      const listItems = (slide as any).items || (slide as any).options || [];
      setAnswer(listItems.map((item: any) => item.id));
    } else {
      setAnswer(undefined);
    }
  }, [slide.id]);

  const renderContent = () => {
    if (submitted && slide.type !== "qa") {
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
    switch (slide.type) {
      case "multiple-choice":
      case "quiz":
      case "image-choice":
        return (
          <div className="mx-auto flex h-full flex-col overflow-hidden p-6 md:max-w-md lg:max-w-xl">
            <h3
              className="mb-6 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-2 pb-4 pt-2">
              {slide.options?.map((option: any, index: number) => (
                <button
                  key={option.id}
                  onClick={() => setAnswer(option.id)}
                  className={`flex items-center rounded-2xl p-4 text-left font-bold transition-all border-2 ${answer === option.id ? 'ring-4 ring-white shadow-lg scale-[1.02]' : 'hover:opacity-90'}`}
                  style={{
                    backgroundColor: option.color || slide.theme.accentColor,
                    color: getContrastColor(option.color || slide.theme.accentColor),
                    borderColor: `${slide.theme.textColor}20`
                  }}
                >
                  <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full text-sm" style={{ backgroundColor: getContrastColor(option.color || slide.theme.accentColor) === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className="text-lg"
                    dangerouslySetInnerHTML={{
                      __html: option.text || `Option ${index + 1}`,
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: answer 
                  ? (slide.options?.find((o: any) => o.id === answer)?.color || slide.theme.accentColor) 
                  : "#ffffff", 
                color: answer 
                  ? getContrastColor(slide.options?.find((o: any) => o.id === answer)?.color || slide.theme.accentColor) 
                  : "rgba(0,0,0,0.4)",
                borderColor: `${slide.theme.textColor}20`
              }}
              disabled={!answer}
              onClick={() => {
                setSubmitted(true);
                onSubmit?.(answer);
              }}
            >
              Submit
            </button>
          </div>
        );

      case "open-ended":
      case "word-cloud":
        return (
          <div className="mx-auto flex h-full flex-col p-6 md:max-w-md lg:max-w-xl">
            <h3
              className="mb-6 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div className="flex-1">
              <textarea
                className="h-40 w-full rounded-2xl border-2 bg-white/10 p-4 text-lg transition-all focus:outline-none focus:ring-4"
                style={
                  {
                    borderColor: slide.theme.accentColor + "60",
                    color: slide.theme.textColor,
                    "--tw-ring-color": slide.theme.accentColor,
                  } as any
                }
                placeholder={(slide as any).placeholder || "Type your answer..."}
                value={answer || ""}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <button
              className="mt-4 h-14 w-full rounded-2xl text-lg font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: (answer && String(answer).trim() !== "") ? slide.theme.accentColor : "#ffffff",
                color: (answer && String(answer).trim() !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
                borderColor: `${slide.theme.textColor}20`
              }}
              disabled={!answer || String(answer).trim() === ""}
              onClick={() => {
                setSubmitted(true);
                onSubmit?.(answer);
              }}
            >
              Submit
            </button>
          </div>
        );

      case "qa":
        return (
          <div className="mx-auto flex h-full flex-col overflow-hidden p-6 md:max-w-md lg:max-w-xl">
            <h3
              className="mb-4 shrink-0 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div className="mb-6 flex shrink-0 gap-2">
              <input
                type="text"
                className="h-12 flex-1 rounded-2xl border-2 bg-neutral-50 px-4 text-black transition-all focus:outline-none focus:ring-2"
                style={
                  {
                    borderColor: slide.theme.accentColor + "60",
                    "--tw-ring-color": slide.theme.accentColor,
                  } as any
                }
                placeholder="Ask a question..."
                value={typeof answer === 'string' ? answer : ''}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button
                className="h-12 rounded-2xl px-6 font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                style={{
                  backgroundColor: (answer && String(answer).trim() !== "") ? slide.theme.accentColor : "#ffffff",
                  color: (answer && String(answer).trim() !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
                  borderColor: `${slide.theme.textColor}20`
                }}
                disabled={!answer || !String(answer).trim()}
              >
                Send
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              <p className="my-8 text-center text-white/45">
                No questions asked yet. Be the first!
              </p>
            </div>
          </div>
        );

      case "rating": {
        const ratingSlide = slide as any;
        const ratingType = ratingSlide.ratingType || "stars";
        const maxValue = ratingSlide.maxValue ?? 5;
        const minValue = ratingSlide.minValue ?? 1;
        const emojis = ["😡", "😕", "😐", "🙂", "😊"];

        return (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <h3
              className="mb-10 text-2xl font-black"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            {ratingType === "stars" && (
              <div className="mb-10 flex flex-wrap justify-center gap-4">
                {Array.from({ length: maxValue }).map((_, index) => (
                  <button key={index} onClick={() => setAnswer(index + 1)}>
                    <svg
                      className={`h-12 w-12 transition-all ${answer && answer > index ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 hover:opacity-70'}`}
                      style={{ color: slide.theme.accentColor }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {ratingType === "emoji" && (
              <div className="mb-10 flex flex-wrap justify-center gap-4">
                {emojis.slice(0, maxValue).map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setAnswer(index + 1)}
                    className={`text-5xl transition-transform ${answer === index + 1 ? 'scale-125 drop-shadow-lg opacity-100' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {(ratingType === "nps" ||
              !["stars", "emoji", "slider"].includes(ratingType)) && (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {Array.from({
                  length:
                    ratingType === "nps" ? 11 : maxValue - minValue + 1,
                }).map((_, index) => {
                  const value = ratingType === "nps" ? index : minValue + index;

                  return (
                    <button
                      key={index}
                      onClick={() => setAnswer(value)}
                      className={`h-12 w-12 rounded-2xl text-lg font-black transition-all ${answer === value ? 'ring-2 ring-white scale-110' : 'opacity-80'}`}
                      style={{
                        backgroundColor: answer === value ? slide.theme.accentColor : "rgba(255,255,255,0.1)",
                        color: slide.theme.textColor,
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              className="mt-4 h-14 w-full rounded-2xl text-lg font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: answer ? slide.theme.accentColor : "#ffffff",
                color: answer ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
                borderColor: `${slide.theme.textColor}20`
              }}
              disabled={!answer}
              onClick={() => setSubmitted(true)}
            >
              Submit
            </button>
          </div>
        );
      }

      case "scales": {
        const scalesSlide = slide as any;
        const steps = scalesSlide.steps ?? 5;
        const scaleLabels = scalesSlide.scaleLabels;
        const leftLabel = Array.isArray(scaleLabels)
          ? scaleLabels[0]
          : scaleLabels?.left || "Strongly Disagree";
        const rightLabel = Array.isArray(scaleLabels)
          ? scaleLabels[scaleLabels.length - 1]
          : scaleLabels?.right || "Strongly Agree";

        return (
          <div className="mx-auto flex h-full flex-col items-center justify-center p-6 text-center md:max-w-md lg:max-w-xl">
            <h3
              className="mb-10 text-2xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div className="mb-4 flex w-full justify-between">
              {Array.from({ length: steps }).map((_, index) => {
                const isSelected = answer === index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => setAnswer(index + 1)}
                    className={`size-12 rounded-full text-sm font-bold transition-all ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                    style={{
                      backgroundColor: isSelected ? slide.theme.accentColor : "rgba(255,255,255,0.1)",
                      color: isSelected ? getContrastColor(slide.theme.accentColor) : slide.theme.textColor,
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex w-full justify-between text-sm font-medium opacity-80">
              <span dangerouslySetInnerHTML={{ __html: leftLabel }} />
              <span dangerouslySetInnerHTML={{ __html: rightLabel }} />
            </div>

            <button
              className="mt-12 h-14 w-full rounded-2xl text-lg font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: answer ? slide.theme.accentColor : "#ffffff",
                color: answer ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
                borderColor: `${slide.theme.textColor}20`
              }}
              disabled={!answer}
              onClick={() => {
                setSubmitted(true);
                onSubmit?.(answer);
              }}
            >
              Submit
            </button>
          </div>
        );
      }

      case "ranking": {
        const listItems = (slide as any).items || (slide as any).options || [];
        const orderedItems = (Array.isArray(answer) ? answer : listItems.map((i: any) => i.id))
          .map((id: string) => listItems.find((i: any) => i.id === id))
          .filter(Boolean);

        return (
          <div className="flex h-full flex-col p-6">
            <h3
              className="mb-2 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <p className="mb-6 text-center text-sm font-medium opacity-70">
              Rank items using the arrows
            </p>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {orderedItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center rounded-2xl border-2 p-4 transition-colors hover:bg-white/10"
                  style={{
                    borderColor: slide.theme.accentColor + "40",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  <span className="mr-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-sm font-bold">
                    {index + 1}
                  </span>

                  <div
                    className="flex-1 text-base font-medium"
                    dangerouslySetInnerHTML={{
                      __html: item.text || `Item ${index + 1}`,
                    }}
                  />

                  <div className="flex gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => {
                        const newAnswer = [...answer];
                        const temp = newAnswer[index];
                        newAnswer[index] = newAnswer[index - 1];
                        newAnswer[index - 1] = temp;
                        setAnswer(newAnswer);
                      }}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-white"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      disabled={index === orderedItems.length - 1}
                      onClick={() => {
                        const newAnswer = [...answer];
                        const temp = newAnswer[index];
                        newAnswer[index] = newAnswer[index + 1];
                        newAnswer[index + 1] = temp;
                        setAnswer(newAnswer);
                      }}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-white"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black border-2 flex items-center justify-center"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: getContrastColor(slide.theme.accentColor),
                borderColor: `${slide.theme.textColor}20`
              }}
              onClick={() => {
                setSubmitted(true);
                const submitValue = Array.isArray(answer)
                  ? answer.reduce((acc: any, id: string, index: number) => {
                      acc[id] = index + 1;
                      return acc;
                    }, {})
                  : {};
                onSubmit?.(submitValue);
              }}
            >
              Submit
            </button>
          </div>
        );
      }

      case "100-points": {
        const pointItems = (slide as any).items || (slide as any).options || [];
        const maxPoints = (slide as any).totalPoints || 100;

        return (
          <div className="mx-auto flex h-full flex-col p-6 md:max-w-md lg:max-w-xl">
            <h3
              className="mb-2 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div
              className="mb-6 text-center font-black"
              style={{ color: slide.theme.textColor }}
            >
              {maxPoints} points remaining
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {pointItems.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="flex items-center rounded-2xl border-2 p-4"
                  style={{
                    borderColor: slide.theme.accentColor + "40",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="flex-1 text-base font-medium"
                    dangerouslySetInnerHTML={{
                      __html: item.text || `Item ${index + 1}`,
                    }}
                  />

                  <input
                    type="number"
                    className="h-10 w-20 rounded-xl bg-black/20 text-center focus:outline-none focus:ring-2"
                    style={
                      {
                        "--tw-ring-color": slide.theme.accentColor,
                      } as any
                    }
                    min="0"
                    max="100"
                    placeholder="0"
                    readOnly
                  />
                </div>
              ))}
            </div>

            <button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black border-2 flex items-center justify-center"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: getContrastColor(slide.theme.accentColor),
                borderColor: `${slide.theme.textColor}20`
              }}
              onClick={() => {
                setSubmitted(true);
                onSubmit?.(pointItems);
              }}
            >
              Submit
            </button>
          </div>
        );
      }

      case "number":
        return (
          <div className="flex h-full flex-col items-center justify-center p-6">
            <h3
              className="mb-10 text-center text-2xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <input
              type="number"
              className="h-20 w-full max-w-xs rounded-2xl bg-neutral-50 text-center text-4xl font-black focus:outline-none focus:ring-4 text-black"
              style={
                {
                  "--tw-ring-color": slide.theme.accentColor,
                } as any
              }
              placeholder="0"
              value={answer || ""}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              className="mt-12 h-14 w-full max-w-xs rounded-2xl text-lg font-black border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: (answer !== null && answer !== undefined && answer !== "") ? slide.theme.accentColor : "#ffffff",
                color: (answer !== null && answer !== undefined && answer !== "") ? getContrastColor(slide.theme.accentColor) : "rgba(0,0,0,0.4)",
                borderColor: `${slide.theme.textColor}20`
              }}
              disabled={answer === null || answer === undefined || answer === ""}
              onClick={() => {
                setSubmitted(true);
                onSubmit?.(Number(answer));
              }}
            >
              Submit
            </button>
          </div>
        );

      case "wheel-of-names":
        return (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <h3
              className="mb-10 text-2xl font-black"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <div
              className="mb-8 flex h-48 w-48 items-center justify-center rounded-full border-4"
              style={{
                borderColor: slide.theme.accentColor,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <span className="text-sm opacity-70">Waiting for spin...</span>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <h3
              className="mb-6 text-3xl font-black"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            {slide.subtitle && (
              <p
                className="text-xl opacity-80"
                dangerouslySetInnerHTML={{ __html: slide.subtitle }}
              />
            )}

            <div className="mt-12 text-sm font-medium opacity-50">
              Look at the presenter&apos;s screen
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            Slide type not supported in participant view yet.
          </div>
        );
    }
  };

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        backgroundColor: slide.theme.backgroundColor,
        color: slide.theme.textColor,
      }}
    >
      {renderContent()}
    </div>
  );
}