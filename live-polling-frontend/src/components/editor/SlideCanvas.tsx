import {
  type Slide,
  type MultipleChoiceSlide,
  type OpenEndedSlide,
  type ContentSlide,
  type WordCloudSlide,
  type RatingSlide,
  type RankingSlide,
  type ScalesSlide,
  type QASlide,
  type PointsSlide,
  type WheelSlide,
  type NumberSlide,
  type QuizSlide,
} from "@/types/presentation";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp } from "lucide-react";
import { type SlideCanvasProps, type ThumbnailSize } from "./types";
import {
  WORD_CLOUD_SAMPLE_WORDS,
  QA_SAMPLE_QUESTIONS,
  WHEEL_COLORS,
} from "./data.const";
import { InlineTextEdit } from "./InlineTextEdit";
import { useAppDispatch } from "@/store/hooks";
import { updateSlide } from "@/store/presentationsSlice";

export type SlideResponses = Record<string, any[]>;

export default function SlideCanvas({
  slide,
  presentationId,
}: SlideCanvasProps) {
  if (!slide) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <p className="text-muted-foreground">Select a slide to edit</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-start justify-top p-8 dark:bg-slate-900 dark:rounded-xl">
      <div
        className="aspect-video w-full max-w-6xl  border-md shadow-xs rounded-2xl overflow-hidden"
        style={{ backgroundColor: slide.theme.backgroundColor }}
      >
        <div className="flex h-full flex-col items-center justify-center p-8">
          {renderSlideContent(slide, false, presentationId)}
        </div>
      </div>
    </div>
  );
}

export function renderSlideContent(
  slide: Slide,
  thumbnailSize: ThumbnailSize,
  presentationId?: string,
  isPreview: boolean = false,
  responses: any[] = []
) {
  switch (slide.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
          responses={responses}
        />
      );
    case "open-ended":
      return (
        <OpenEndedContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "content":
      return (
        <ContentContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "word-cloud":
      console.log("[renderSlideContent] word-cloud case received responses:", responses);
      return (
        <WordCloudContent
          thumbnailSize={thumbnailSize}
          slide={slide as any}
          presentationId={presentationId}
          isPreview={isPreview}
          responses={responses}
        />
      );
    case "rating":
      return (
        <RatingContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "ranking":
      return (
        <RankingContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "scales":
      return (
        <ScalesContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "qa":
      return (
        <QAContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "100-points":
      return (
        <PointsContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "wheel-of-names":
      return (
        <WheelContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "number":
      return (
        <NumberContent
          thumbnailSize={thumbnailSize}
          slide={slide as any}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
    case "quiz":
      return (
        <QuizContent
          thumbnailSize={thumbnailSize}
          slide={slide as any}
          presentationId={presentationId}
          isPreview={isPreview}
          responses={responses}
        />
      );
    default:
      return (
        <DefaultContent
          thumbnailSize={thumbnailSize}
          slide={slide}
          presentationId={presentationId}
          isPreview={isPreview}
        />
      );
  }
}

function MultipleChoiceContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
  responses,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: MultipleChoiceSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
  responses?: any[] | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-1",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Multiple choice" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "flex flex-wrap items-center justify-center",
            isCard ? "mt-1 gap-1.5" : "mt-0.5 gap-1",
          )}
        >
          {slide.options.slice(0, 4).map((option, index) => (
            <span
              key={option.id}
              className={cn(
                "rounded font-medium text-white",
                isCard ? "px-2 py-1 text-[10px]" : "px-1.5 py-0.5 text-[8px]",
              )}
              style={{
                backgroundColor: option.color || slide.theme.accentColor,
              }}
            >
              {String.fromCharCode(65 + index)}
            </span>
          ))}
          {slide.options.length > 4 && (
            <span
              className={cn(
                "opacity-70",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              +{slide.options.length - 4}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  const totalResponses = responses?.length || 0;
  const counts: Record<string, number> = {};
  responses?.forEach((r: any) => { counts[r] = (counts[r] || 0) + 1; });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 text-center w-full">
        <InlineTextEdit
          text={slide.title || ""}
          placeholder="Your question here"
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(title) => handleUpdate({ title })}
          className="text-3xl font-bold mb-2 block w-full max-w-4xl mx-auto"
          style={{ color: slide.theme.textColor }}
        />
        {(slide.subtitle || (!isThumbnail && !isPreview)) && (
          <InlineTextEdit
            text={slide.subtitle || ""}
            placeholder="Add a subtitle..."
            isEditable={(!isThumbnail && !isPreview)}
            onUpdate={(subtitle) => handleUpdate({ subtitle })}
            className="text-lg opacity-70 block w-full max-w-3xl mx-auto"
            style={{ color: slide.theme.textColor }}
          />
        )}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {slide.options.map((option, index) => {
          const count = counts[option.id] || 0;
          const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
          
          return (
            <div
              key={option.id}
              className={cn(
                "relative flex items-center justify-start rounded-xl font-medium text-white transition-transform overflow-hidden",
                isPreview ? "p-4 text-base" : "p-6 text-lg"
              )}
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div 
                className="absolute inset-0 z-0 transition-all duration-500 ease-in-out" 
                style={{ 
                  backgroundColor: option.color || slide.theme.accentColor,
                  width: totalResponses > 0 ? `${percentage}%` : '100%',
                  opacity: totalResponses > 0 ? 1 : 0.8
                }} 
              />
              <div className="relative z-10 flex items-center w-full">
                <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <InlineTextEdit
                  text={option.text || ""}
                  placeholder={`Option ${index + 1}`}
                  isEditable={(!isThumbnail && !isPreview)}
                  onUpdate={(newText) => {
                    const newOptions = slide.options.map(o => o.id === option.id ? { ...o, text: newText } : o);
                    handleUpdate({ options: newOptions });
                  }}
                  className="flex-1 w-full text-left"
                />
                {totalResponses > 0 && (
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xl font-bold">{count}</span>
                    <span className="text-sm opacity-70">({percentage}%)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpenEndedContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: OpenEndedSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Open-ended" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "mt-1 w-full max-w-[90%] rounded border border-dashed opacity-70",
            isCard ? "px-2.5 py-1.5 text-[10px]" : "px-2 py-1 text-[8px]",
          )}
          style={{
            borderColor: slide.theme.accentColor + "60",
            color: slide.theme.textColor,
          }}
        >
          {slide.placeholder || "Type your answer..."}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Your question here"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      <div
        className="w-full max-w-xl rounded-xl border-2 border-dashed p-8 text-center"
        style={{ borderColor: slide.theme.accentColor + "40" }}
      >
        <p className="text-muted-foreground">
          {slide.placeholder || "Participants will type their answers here..."}
        </p>
      </div>
    </div>
  );
}

function ContentContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: ContentSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Content" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        {slide.content && (
          <p
            className={cn(
              "line-clamp-2 max-w-full opacity-70",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        )}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Slide Title"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-4xl font-bold mb-4 block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-xl mb-6 opacity-70 block w-full max-w-3xl"
          style={{ color: slide.theme.textColor }}
        />
      )}
      {(slide.content || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.content || ""}
          placeholder="Add body content..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(content) => handleUpdate({ content })}
          className="text-lg max-w-2xl opacity-80 block w-full"
          style={{ color: slide.theme.textColor }}
        />
      )}
    </div>
  );
}

function WordCloudContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
  responses = [],
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: WordCloudSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
  responses?: any[] | undefined;
}) {
  console.log("[WordCloudContent] function called with responses:", responses);
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const sampleWords = WORD_CLOUD_SAMPLE_WORDS;

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };

  if (isThumbnail) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-0 overflow-hidden text-center">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full px-0.5 font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Word cloud" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "shrink-0 line-clamp-1 w-full px-0.5 opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "shrink-0 flex w-full min-w-0 max-w-full flex-wrap items-center justify-center overflow-hidden px-0.5",
            isCard ? "mt-1 gap-1" : "mt-0.5 gap-0.5",
          )}
        >
          {sampleWords.slice(0, 3).map((word, i) => (
            <span
              key={i}
              className={cn(
                "font-medium opacity-80 truncate",
                isCard ? "text-[10px] max-w-20" : "max-w-16 text-[8px]",
              )}
              style={{ color: slide.theme.accentColor }}
            >
              {word}
            </span>
          ))}
        </div>
        <p
          className={cn(
            "shrink-0 opacity-60",
            isCard ? "text-[10px]" : "text-[8px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          up to {slide.maxWords || 3} words
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="What comes to mind?"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl">
        {responses?.length > 0 ? (
          responses.flatMap(r => Array.isArray(r) ? r : String(r).split(',').map(s => s.trim())).filter(w => w.length > 0).map((word, i) => (
            <span
              key={i}
              className="transition-all"
              style={{
                color: slide.theme.accentColor,
                fontSize: `${1.5 + Math.random() * 1.5}rem`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            >
              {word}
            </span>
          ))
        ) : isPreview ? (
          <div className="text-xl font-medium opacity-50" style={{ color: slide.theme.textColor }}>Waiting for responses...</div>
        ) : (
          sampleWords.map((word, i) => (
            <span
              key={i}
              className="transition-all"
              style={{
                color: slide.theme.accentColor,
                fontSize: `${1.5 + Math.random() * 1.5}rem`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            >
              {word}
            </span>
          ))
        )}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Enter up to {slide.maxWords || 3} words
      </p>
    </div>
  );
}

function RatingContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: RatingSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  const renderRatingUI = () => {
    const meta = (slide as any).meta || {};
    const ratingType = slide.ratingType || meta.ratingType || "stars";
    const maxValue = slide.maxValue ?? meta.maxValue ?? 5;
    const minValue = slide.minValue ?? meta.minValue ?? 1;
    const maxLabel = slide.maxLabel || meta.maxLabel;
    const minLabel = slide.minLabel || meta.minLabel;

    switch (ratingType) {
      case "stars":
        return (
          <div className="flex gap-2">
            {Array.from({ length: maxValue }).map((_, i) => (
              <Star
                key={i}
                className="size-12 cursor-pointer transition-all hover:scale-110"
                style={{
                  color:
                    i < 3
                      ? slide.theme.accentColor
                      : slide.theme.textColor + "30",
                  fill: i < 3 ? slide.theme.accentColor : "none",
                }}
              />
            ))}
          </div>
        );
      case "emoji":
        const emojis = ["😡", "😕", "😐", "🙂", "😊"];
        return (
          <div className="flex gap-4">
            {emojis.slice(0, maxValue).map((emoji, i) => (
              <button
                key={i}
                className="text-4xl transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        );
      case "nps":
        return (
          <div className="flex gap-1">
            {Array.from({ length: 11 }).map((_, i) => (
              <button
                key={i}
                className="size-10 rounded-lg text-sm font-medium transition-all hover:scale-110"
                style={{
                  backgroundColor:
                    i === 7
                      ? slide.theme.accentColor
                      : slide.theme.textColor + "10",
                  color: i === 7 ? "#fff" : slide.theme.textColor,
                }}
              >
                {i}
              </button>
            ))}
          </div>
        );
      case "slider":
        return (
          <div className="w-full max-w-md">
            <div
              className="h-2 rounded-full"
              style={{ backgroundColor: slide.theme.textColor + "20" }}
            >
              <div
                className="h-full w-3/5 rounded-full transition-all"
                style={{ backgroundColor: slide.theme.accentColor }}
              />
            </div>
            <div
              className="flex justify-between mt-2 text-sm"
              style={{ color: slide.theme.textColor }}
            >
              <span>{minLabel || minValue}</span>
              <span>{maxLabel || maxValue}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex gap-2">
            {Array.from({ length: maxValue - minValue + 1 }).map(
              (_, i) => (
                <button
                  key={i}
                  className="size-12 rounded-xl text-lg font-medium transition-all hover:scale-110"
                  style={{
                    backgroundColor:
                      i === 2
                        ? slide.theme.accentColor
                        : slide.theme.textColor + "10",
                    color: i === 2 ? "#fff" : slide.theme.textColor,
                  }}
                >
                  {minValue + i}
                </button>
              ),
            )}
          </div>
        );
    }
  };

  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Rating" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn("mt-1 flex items-center", isCard ? "gap-1" : "gap-0.5")}
        >
          {((slide.ratingType || (slide as any).meta?.ratingType) === "stars") &&
            Array.from({ length: Math.min(slide.maxValue ?? (slide as any).meta?.maxValue ?? 5, 5) }).map((_, i) => (
              <Star
                key={i}
                className={isCard ? "size-4" : "size-3"}
                style={{
                  color: slide.theme.accentColor,
                  fill: i < 2 ? slide.theme.accentColor : "none",
                }}
              />
            ))}
          {((slide.ratingType || (slide as any).meta?.ratingType) === "emoji") && (
            <span className={isCard ? "text-xs" : "text-[10px]"}>😡 😐 😊</span>
          )}
          {((slide.ratingType || (slide as any).meta?.ratingType) === "nps") && (
            <span
              className={cn(
                "opacity-80",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              0–10 NPS
            </span>
          )}
          {((slide.ratingType || (slide as any).meta?.ratingType) === "slider") && (
            <div
              className={cn("rounded-full", isCard ? "h-1.5 w-16" : "h-1 w-12")}
              style={{ backgroundColor: slide.theme.accentColor + "60" }}
            />
          )}
          {!["stars", "emoji", "nps", "slider"].includes((slide.ratingType || (slide as any).meta?.ratingType)) && (
            <span
              className={cn(
                "opacity-80",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              {(slide.minValue ?? (slide as any).meta?.minValue ?? 1)}–{(slide.maxValue ?? (slide as any).meta?.maxValue ?? 5)}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Rating Question"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      {renderRatingUI()}
    </div>
  );
}

function RankingContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: RankingSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    const itemsArray = Array.isArray((slide as any).options || slide.items) ? ((slide as any).options || slide.items) : [];
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Ranking" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div className={cn("mt-1 flex flex-col", isCard ? "gap-1" : "gap-0.5")}>
          {itemsArray.slice(0, 3).map((item: any, index: number) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-1 rounded",
                  isCard ? "px-2 py-1" : "px-1.5 py-0.5",
                )}
                style={{
                  backgroundColor:
                    (item.color || slide.theme.accentColor) + "30",
                }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full font-bold text-white",
                    isCard ? "size-4 text-[8px]" : "size-3.5 text-[6px]",
                  )}
                  style={{ backgroundColor: slide.theme.accentColor }}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "truncate",
                    isCard ? "text-[10px]" : "text-[8px]",
                  )}
                  style={{ color: slide.theme.textColor }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          {itemsArray.length > 3 && (
            <span
              className={cn(
                "opacity-60",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              +{itemsArray.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Ranking Question"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      <div className="w-full max-w-md space-y-3">
        {(() => {
          const itemsArray = Array.isArray((slide as any).options || slide.items) ? ((slide as any).options || slide.items) : [];
          return itemsArray.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl p-4 transition-all"
              style={{
                backgroundColor: item.color || slide.theme.accentColor + "20",
              }}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: slide.theme.accentColor,
                  color: "#fff",
                }}
              >
                {index + 1}
              </span>
              <InlineTextEdit
                text={item.text || ""}
                placeholder={`Item ${index + 1}`}
                isEditable={(!isThumbnail && !isPreview)}
                onUpdate={(newText) => {
                  const newItems = itemsArray.map((o: any) => o.id === item.id ? { ...o, text: newText } : o);
                  handleUpdate({ options: newItems });
                }}
                className="flex-1 w-full text-left"
                style={{ color: slide.theme.textColor }}
              />
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

function ScalesContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: ScalesSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    const meta = (slide as any).meta || {};
    const steps = slide.steps ?? meta.steps ?? 5;
    const statement = slide.statement || meta.statement || "";
    const labels = slide.scaleLabels || meta.scaleLabels;
    const leftLabel = Array.isArray(labels) ? labels[0] : labels?.left;
    const rightLabel = Array.isArray(labels) ? labels[labels.length - 1] : labels?.right;

    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-start gap-0 overflow-hidden px-0.5 text-center">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Scales" }}
        />
        <p
          className={cn(
            "mt-0.5 shrink-0 line-clamp-2 w-full overflow-hidden opacity-80",
            isCard ? "text-[10px]" : "text-[8px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: `&quot;${statement}&quot;` }}
        />
        <div
          className={cn(
            "mt-0.5 shrink-0 flex items-center",
            isCard ? "gap-1" : "gap-0.5",
          )}
        >
          {Array.from({ length: Math.min(steps, 5) }).map((_, i) => (
            <span
              key={i}
              className={cn("rounded-full", isCard ? "size-2.5" : "size-2")}
              style={{
                backgroundColor:
                  i === Math.floor(steps / 2)
                    ? slide.theme.accentColor
                    : slide.theme.textColor + "30",
              }}
            />
          ))}
        </div>
        <p
          className={cn(
            "mt-0.5 shrink-0 opacity-60",
            isCard ? "text-[10px]" : "text-[8px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          {leftLabel} – {rightLabel}
        </p>
      </div>
    );
  }
  const meta = (slide as any).meta || {};
  const steps = slide.steps ?? meta.steps ?? 5;
  const statement = slide.statement || meta.statement || "";
  const labels = slide.scaleLabels || meta.scaleLabels;
  const leftLabel = Array.isArray(labels) ? labels[0] : labels?.left;
  const rightLabel = Array.isArray(labels) ? labels[labels.length - 1] : labels?.right;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Scales"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      <InlineTextEdit
        text={statement || ""}
        placeholder="Enter a statement..."
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(newStatement) => handleUpdate({ statement: newStatement })}
        className="text-xl mb-8 text-center max-w-2xl block w-full"
        style={{ color: slide.theme.textColor }}
      />
      <div className="w-full max-w-xl">
        <div className="flex justify-between mb-4">
          {Array.from({ length: steps }).map((_, i) => (
            <button
              key={i}
              className="size-12 rounded-full text-sm font-medium transition-all hover:scale-110"
              style={{
                backgroundColor:
                  i === Math.floor(steps / 2)
                    ? slide.theme.accentColor
                    : slide.theme.textColor + "10",
                color:
                  i === Math.floor(steps / 2)
                    ? "#fff"
                    : slide.theme.textColor,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div
          className="flex justify-between text-sm w-full"
          style={{ color: slide.theme.textColor }}
        >
          <InlineTextEdit
            text={leftLabel || ""}
            placeholder="Left label"
            isEditable={(!isThumbnail && !isPreview)}
            onUpdate={(left) => handleUpdate({ scaleLabels: { left, right: rightLabel || "" } })}
            className="inline-block min-w-[4rem]"
          />
          <InlineTextEdit
            text={rightLabel || ""}
            placeholder="Right label"
            isEditable={(!isThumbnail && !isPreview)}
            onUpdate={(right) => handleUpdate({ scaleLabels: { left: leftLabel || "", right } })}
            className="inline-block min-w-[4rem] text-right"
          />
        </div>
      </div>
    </div>
  );
}

function QAContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: QASlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const sampleQuestions = QA_SAMPLE_QUESTIONS;
  const displayQuestions = slide.questions && slide.questions.length > 0 ? slide.questions : sampleQuestions;

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };

  if (isThumbnail) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-stretch justify-center gap-0 overflow-hidden px-0.5">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full text-center font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Q&A" }}
        />
        <div
          className={cn(
            "mt-0.5 flex w-full min-w-0 flex-col overflow-hidden",
            isCard ? "gap-1" : "gap-0.5",
          )}
        >
          {displayQuestions.slice(0, 2).map((q, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full min-w-0 items-center gap-1 overflow-hidden rounded",
                isCard ? "px-2 py-1" : "px-1.5 py-0.5",
              )}
              style={{ backgroundColor: slide.theme.textColor + "15" }}
            >
              <ThumbsUp
                className={cn("shrink-0", isCard ? "size-3" : "size-2.5")}
                style={{ color: slide.theme.accentColor }}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left",
                  isCard ? "text-[10px]" : "text-[8px] w-10",
                )}
                style={{ color: slide.theme.textColor }}
                title={q.text}
              >
                {q.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Q&A Session"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-6 text-center block w-full max-w-4xl mx-auto"
        style={{ color: slide.theme.textColor }}
      />
      <div className="flex-1 space-y-3 max-w-xl mx-auto w-full">
        {displayQuestions.map((q, i) => (
          <div
            key={(q as any).id || i}
            className="flex items-center gap-3 rounded-xl p-4"
            style={{ backgroundColor: slide.theme.textColor + "10" }}
          >
            <button
              className="flex flex-col items-center gap-1 px-2 shrink-0"
              style={{ color: slide.theme.accentColor }}
            >
              <ThumbsUp className="size-4" />
              <span className="text-xs font-medium">{q.upvotes || 0}</span>
            </button>
            <InlineTextEdit
              text={q.text || ""}
              placeholder="Question"
              isEditable={(!isThumbnail && !isPreview)}
              onUpdate={(newText) => {
                const newQs = [...displayQuestions];
                newQs[i] = { ...newQs[i], text: newText };
                handleUpdate({ questions: newQs as any });
              }}
              className="flex-1 w-full text-left"
              style={{ color: slide.theme.textColor }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PointsContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: PointsSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const itemsArray = Array.isArray((slide as any).options || slide.items) ? ((slide as any).options || slide.items) : [];
  const mockAllocations = itemsArray.map(
    (_: any, i: number) =>
      Math.floor(slide.totalPoints / itemsArray.length) +
      (i === 0 ? slide.totalPoints % itemsArray.length : 0),
  );

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };

  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "100 points" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "mt-1 w-full max-w-[95%]",
            isCard ? "space-y-1" : "space-y-0.5",
          )}
        >
          {itemsArray.slice(0, 3).map((item: any, index: number) => (
              <div key={item.id} className="flex items-center gap-1">
                <div
                  className={cn(
                    "flex-1 rounded-full overflow-hidden",
                    isCard ? "h-1.5" : "h-1",
                  )}
                  style={{ backgroundColor: slide.theme.textColor + "20" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(mockAllocations[index] / slide.totalPoints) * 100}%`,
                      backgroundColor: item.color || slide.theme.accentColor,
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "w-6 text-right font-medium",
                    isCard ? "text-[10px]" : "text-[8px]",
                  )}
                  style={{ color: slide.theme.accentColor }}
                >
                  {mockAllocations[index]}
                </span>
              </div>
            ))}
        </div>
        <p
          className={cn("opacity-60", isCard ? "text-[10px]" : "text-[8px]")}
          style={{ color: slide.theme.textColor }}
        >
          {slide.totalPoints} pts total
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="100 points"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      <div className="w-full max-w-md space-y-4">
        {itemsArray.map((item: any, index: number) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between items-center w-full gap-4">
                <InlineTextEdit
                  text={item.text || ""}
                  placeholder={`Item ${index + 1}`}
                  isEditable={(!isThumbnail && !isPreview)}
                  onUpdate={(newText) => {
                    const newItems = itemsArray.map((o: any) => o.id === item.id ? { ...o, text: newText } : o);
                    handleUpdate({ options: newItems });
                  }}
                  className="flex-1 text-left"
                  style={{ color: slide.theme.textColor }}
                />
                <span
                  className="font-bold shrink-0"
                  style={{ color: slide.theme.accentColor }}
                >
                  {mockAllocations[index]} pts
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: slide.theme.textColor + "20" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(mockAllocations[index] / slide.totalPoints) * 100}%`,
                    backgroundColor: item.color || slide.theme.accentColor,
                  }}
                />
              </div>
            </div>
          ))}
      </div>
      <p
        className="mt-6 text-sm"
        style={{ color: slide.theme.textColor + "70" }}
      >
        Total: {slide.totalPoints} points to distribute
      </p>
    </div>
  );
}

function WheelContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: WheelSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const colors = WHEEL_COLORS;
  const segmentAngle = 360 / slide.names.length;

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };

  if (isThumbnail) {
    const wheelSize = isCard ? 36 : 24;
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-0 overflow-hidden text-center">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full px-0.5 font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Wheel of names" }}
        />
        <div
          className={cn(
            "shrink-0 flex items-center justify-center",
            isCard ? "my-1 size-9" : "my-0.5 size-6",
          )}
        >
          <svg
            width={wheelSize}
            height={wheelSize}
            viewBox="0 0 40 40"
            className="block rounded-full"
            style={{ border: `1px solid ${slide.theme.accentColor}50` }}
          >
            {slide.names.slice(0, 6).map((_, i) => {
              const n = Math.min(slide.names.length, 6);
              const startAngle = (i * 360) / n - 90;
              const endAngle = ((i + 1) * 360) / n - 90;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 20 + 18 * Math.cos(startRad);
              const y1 = 20 + 18 * Math.sin(startRad);
              const x2 = 20 + 18 * Math.cos(endRad);
              const y2 = 20 + 18 * Math.sin(endRad);
              const largeArc = 360 / n > 180 ? 1 : 0;
              return (
                <path
                  key={i}
                  d={`M 20 20 L ${x1} ${y1} A 18 18 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
            })}
            <circle
              cx="20"
              cy="20"
              r="4"
              fill={slide.theme.backgroundColor}
              stroke={slide.theme.accentColor}
              strokeWidth="1"
            />
          </svg>
        </div>
        <p
          className={cn(
            "shrink-0 opacity-70",
            isCard ? "text-[10px]" : "text-[8px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          {slide.names.length} name{slide.names.length !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Wheel of Names"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-6 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      <div className="relative">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {slide.names.map((name, i) => {
            const startAngle = i * segmentAngle - 90;
            const endAngle = (i + 1) * segmentAngle - 90;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 150 + 140 * Math.cos(startRad);
            const y1 = 150 + 140 * Math.sin(startRad);
            const x2 = 150 + 140 * Math.cos(endRad);
            const y2 = 150 + 140 * Math.sin(endRad);
            const largeArc = segmentAngle > 180 ? 1 : 0;
            const textAngle = startAngle + segmentAngle / 2;
            const textRad = (textAngle * Math.PI) / 180;
            const textX = 150 + 90 * Math.cos(textRad);
            const textY = 150 + 90 * Math.sin(textRad);

            return (
              <g key={i}>
                <path
                  d={`M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                >
                  {name.length > 8 ? name.slice(0, 8) + "..." : name}
                </text>
              </g>
            );
          })}
          <circle
            cx="150"
            cy="150"
            r="20"
            fill={slide.theme.backgroundColor}
            stroke={slide.theme.accentColor}
            strokeWidth="3"
          />
        </svg>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
          style={{ color: slide.theme.accentColor }}
        >
          <div
            className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-t-5"
            style={{ borderTopColor: slide.theme.accentColor }}
          />
        </div>
      </div>
      <button
        className="mt-6 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
        style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}
      >
        Spin the Wheel!
      </button>
    </div>
  );
}

function DefaultContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: Slide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-2 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Slide" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Slide Title"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-4xl font-bold mb-4 block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-xl opacity-70 block w-full max-w-3xl"
          style={{ color: slide.theme.textColor }}
        />
      )}
    </div>
  );
}

function NumberContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,
}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: NumberSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };

  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-0.5",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Number input" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "mt-1 w-full max-w-[80%] rounded border border-dashed opacity-70",
            isCard ? "px-2 py-1 text-[10px]" : "px-1.5 py-0.5 text-[8px]",
          )}
          style={{
            borderColor: slide.theme.accentColor + "60",
            color: slide.theme.textColor,
          }}
        >
          123...
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <InlineTextEdit
        text={slide.title || ""}
        placeholder="Number Question"
        isEditable={(!isThumbnail && !isPreview)}
        onUpdate={(title) => handleUpdate({ title })}
        className="text-3xl font-bold mb-4 text-center block w-full max-w-4xl"
        style={{ color: slide.theme.textColor }}
      />
      {(slide.subtitle || (!isThumbnail && !isPreview)) && (
        <InlineTextEdit
          text={slide.subtitle || ""}
          placeholder="Add a subtitle..."
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(subtitle) => handleUpdate({ subtitle })}
          className="text-lg mb-8 opacity-70 block w-full max-w-3xl text-center"
          style={{ color: slide.theme.textColor }}
        />
      )}
      <div
        className="w-full max-w-xl rounded-xl border-2 border-dashed p-8 text-center flex flex-col items-center justify-center gap-2"
        style={{ borderColor: slide.theme.accentColor + "40" }}
      >
        <span className="text-4xl font-mono" style={{ color: slide.theme.textColor + "80" }}>123</span>
        <p className="text-muted-foreground">
          Participants will input a number here.
        </p>
      </div>
    </div>
  );
}

function QuizContent({
  slide,
  thumbnailSize,
  presentationId,
  isPreview,

}: {
  thumbnailSize?: ThumbnailSize | undefined;
  slide: QuizSlide;
  presentationId?: string | undefined;
  isPreview?: boolean | undefined;
  responses?: any[] | undefined;
}) {
  const dispatch = useAppDispatch();
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";

  const handleUpdate = (updates: Partial<Slide>) => {
    if (presentationId && (!isThumbnail && !isPreview)) {
      dispatch(updateSlide({ presentationId, slideId: slide.id, updates }));
    }
  };
  
  const optionsArray = Array.isArray((slide as any).options || (slide as any).items) ? ((slide as any).options || (slide as any).items) : [];

  if (isThumbnail) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center text-center",
          isCard ? "gap-1.5" : "gap-1",
        )}
      >
        <h2
          className={cn(
            "line-clamp-1 max-w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
          dangerouslySetInnerHTML={{ __html: slide.title || "Quiz" }}
        />
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
            dangerouslySetInnerHTML={{ __html: slide.subtitle }}
          />
        )}
        <div
          className={cn(
            "flex flex-wrap items-center justify-center",
            isCard ? "mt-1 gap-1.5" : "mt-0.5 gap-1",
          )}
        >
          {optionsArray.slice(0, 4).map((option: any, index: number) => (
            <span
              key={option.id || index}
              className={cn(
                "rounded font-medium text-white border",
                isCard ? "px-2 py-1 text-[10px]" : "px-1.5 py-0.5 text-[8px]",
              )}
              style={{
                backgroundColor: option.color || slide.theme.accentColor,
                borderColor: option.isCorrect && !isPreview ? "#22c55e" : "transparent"
              }}
            >
              {String.fromCharCode(65 + index)}
            </span>
          ))}
          {optionsArray.length > 4 && (
            <span
              className={cn(
                "opacity-70",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              +{optionsArray.length - 4}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 text-center w-full relative">
        <div className="absolute right-0 top-0 flex flex-col items-end gap-1">
          <span className="text-sm font-bold opacity-80" style={{ color: slide.theme.textColor }}>{slide.timeLimit || 15}s</span>
          <span className="text-xs opacity-60" style={{ color: slide.theme.textColor }}>{slide.points || 1000} pts</span>
        </div>
        <InlineTextEdit
          text={slide.title || ""}
          placeholder="Your quiz question here"
          isEditable={(!isThumbnail && !isPreview)}
          onUpdate={(title) => handleUpdate({ title })}
          className="text-3xl font-bold mb-2 block w-full max-w-4xl mx-auto"
          style={{ color: slide.theme.textColor }}
        />
        {(slide.subtitle || (!isThumbnail && !isPreview)) && (
          <InlineTextEdit
            text={slide.subtitle || ""}
            placeholder="Add a subtitle..."
            isEditable={(!isThumbnail && !isPreview)}
            onUpdate={(subtitle) => handleUpdate({ subtitle })}
            className="text-lg opacity-70 block w-full max-w-3xl mx-auto"
            style={{ color: slide.theme.textColor }}
          />
        )}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {optionsArray.map((option: any, index: number) => (
          <div
            key={option.id || index}
            className={cn(
              "flex items-center justify-start rounded-xl font-medium text-white transition-transform",
              isPreview ? "p-4 text-base" : "p-6 text-lg",
              option.isCorrect && !isPreview ? "ring-4 ring-green-500" : ""
            )}
            style={{ backgroundColor: option.color || slide.theme.accentColor }}
          >
            <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
              {String.fromCharCode(65 + index)}
            </span>
            <InlineTextEdit
              text={option.text || ""}
              placeholder={`Option ${index + 1}`}
              isEditable={(!isThumbnail && !isPreview)}
              onUpdate={(newText) => {
                const newOptions = optionsArray.map((o: any) => o.id === option.id ? { ...o, text: newText } : o);
                handleUpdate({ options: newOptions });
              }}
              className="flex-1 w-full text-left"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
