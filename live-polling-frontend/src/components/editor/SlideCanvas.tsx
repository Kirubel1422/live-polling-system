import {
  Slide,
  MultipleChoiceSlide,
  OpenEndedSlide,
  ContentSlide,
  WordCloudSlide,
  RatingSlide,
  RankingSlide,
  ScalesSlide,
  QASlide,
  PointsSlide,
  WheelSlide,
} from "@/types/presentation";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp } from "lucide-react";
import { SlideCanvasProps, ThumbnailSize } from "./types";
import { WORD_CLOUD_SAMPLE_WORDS, QA_SAMPLE_QUESTIONS, WHEEL_COLORS } from "./data.const";

export default function SlideCanvas({ slide }: SlideCanvasProps) {
  if (!slide) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <p className="text-muted-foreground">Select a slide to edit</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-start justify-top p-8">
      <div
        className="aspect-video w-full max-w-6xl  border-md shadow-xs rounded-2xl overflow-hidden"
        style={{ backgroundColor: slide.theme.backgroundColor }}
      >
        <div className="flex h-full flex-col items-center justify-center p-8">
          {renderSlideContent(slide, false)}
        </div>
      </div>
    </div>
  );
}

export function renderSlideContent(slide: Slide, thumbnailSize: ThumbnailSize) {
  switch (slide.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceContent thumbnailSize={thumbnailSize} slide={slide} />
      );
    case "open-ended":
      return <OpenEndedContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "content":
      return <ContentContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "word-cloud":
      return <WordCloudContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "rating":
      return <RatingContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "ranking":
      return <RankingContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "scales":
      return <ScalesContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "qa":
      return <QAContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "100-points":
      return <PointsContent thumbnailSize={thumbnailSize} slide={slide} />;
    case "wheel-of-names":
      return <WheelContent thumbnailSize={thumbnailSize} slide={slide} />;
    default:
      return <DefaultContent thumbnailSize={thumbnailSize} slide={slide} />;
  }
}

function MultipleChoiceContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: MultipleChoiceSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
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
        >
          {slide.title || "Multiple choice"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
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
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || "Your question here"}
        </h2>
        {slide.subtitle && (
          <p
            className="text-lg opacity-70"
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {slide.options.map((option, index) => (
          <button
            key={option.id}
            className={cn(
              "flex items-center justify-center rounded-xl p-6 text-lg font-medium text-white transition-transform hover:scale-[1.02]",
            )}
            style={{ backgroundColor: option.color || slide.theme.accentColor }}
          >
            <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-white/20 text-sm">
              {String.fromCharCode(65 + index)}
            </span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function OpenEndedContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: OpenEndedSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
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
        >
          {slide.title || "Open-ended"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
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
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || "Your question here"}
      </h2>
      {slide.subtitle && (
        <p
          className="text-lg mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
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
}: {
  thumbnailSize?: ThumbnailSize;
  slide: ContentSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
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
        >
          {slide.title || "Content"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
        {slide.content && (
          <p
            className={cn(
              "line-clamp-2 max-w-full opacity-70",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.content}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || "Slide Title"}
      </h2>
      {slide.subtitle && (
        <p
          className="text-xl mb-6 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <p
          className="text-lg max-w-2xl opacity-80"
          style={{ color: slide.theme.textColor }}
        >
          {slide.content}
        </p>
      )}
    </div>
  );
}

function WordCloudContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: WordCloudSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const sampleWords = WORD_CLOUD_SAMPLE_WORDS;

  if (isThumbnail) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-0 overflow-hidden text-center">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full px-0.5 font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || "Word cloud"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "shrink-0 line-clamp-1 w-full px-0.5 opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
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
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || "What comes to mind?"}
      </h2>
      {slide.subtitle && (
        <p
          className="text-lg mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl">
        {sampleWords.map((word, i) => (
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
        ))}
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
}: {
  thumbnailSize?: ThumbnailSize;
  slide: RatingSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const renderRatingUI = () => {
    switch (slide.ratingType) {
      case "stars":
        return (
          <div className="flex gap-2">
            {Array.from({ length: slide.maxValue }).map((_, i) => (
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
            {emojis.slice(0, slide.maxValue).map((emoji, i) => (
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
              <span>{slide.minLabel || slide.minValue}</span>
              <span>{slide.maxLabel || slide.maxValue}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex gap-2">
            {Array.from({ length: slide.maxValue - slide.minValue + 1 }).map(
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
                  {slide.minValue + i}
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
        >
          {slide.title || "Rating"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
        <div
          className={cn("mt-1 flex items-center", isCard ? "gap-1" : "gap-0.5")}
        >
          {slide.ratingType === "stars" &&
            Array.from({ length: Math.min(slide.maxValue, 5) }).map((_, i) => (
              <Star
                key={i}
                className={isCard ? "size-4" : "size-3"}
                style={{
                  color: slide.theme.accentColor,
                  fill: i < 2 ? slide.theme.accentColor : "none",
                }}
              />
            ))}
          {slide.ratingType === "emoji" && (
            <span className={isCard ? "text-xs" : "text-[10px]"}>😡 😐 😊</span>
          )}
          {slide.ratingType === "nps" && (
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
          {slide.ratingType === "slider" && (
            <div
              className={cn("rounded-full", isCard ? "h-1.5 w-16" : "h-1 w-12")}
              style={{ backgroundColor: slide.theme.accentColor + "60" }}
            />
          )}
          {!["stars", "emoji", "nps", "slider"].includes(slide.ratingType) && (
            <span
              className={cn(
                "opacity-80",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              {slide.minValue}–{slide.maxValue}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-lg mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      {renderRatingUI()}
    </div>
  );
}

function RankingContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: RankingSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
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
        >
          {slide.title || "Ranking"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
        <div className={cn("mt-1 flex flex-col", isCard ? "gap-1" : "gap-0.5")}>
          {slide.items.slice(0, 3).map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-1 rounded",
                isCard ? "px-2 py-1" : "px-1.5 py-0.5",
              )}
              style={{
                backgroundColor: (item.color || slide.theme.accentColor) + "30",
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
          {slide.items.length > 3 && (
            <span
              className={cn(
                "opacity-60",
                isCard ? "text-[10px]" : "text-[8px]",
              )}
              style={{ color: slide.theme.textColor }}
            >
              +{slide.items.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-lg mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      <div className="w-full max-w-md space-y-3">
        {slide.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl p-4 transition-all"
            style={{
              backgroundColor: item.color || slide.theme.accentColor + "20",
            }}
          >
            <span
              className="flex size-8 items-center justify-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              {index + 1}
            </span>
            <span style={{ color: slide.theme.textColor }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScalesContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: ScalesSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  if (isThumbnail) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-start gap-0 overflow-hidden px-0.5 text-center">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || "Scales"}
        </h2>
        <p
          className={cn(
            "mt-0.5 shrink-0 line-clamp-2 w-full overflow-hidden opacity-80",
            isCard ? "text-[10px]" : "text-[8px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          &quot;{slide.statement}&quot;
        </p>
        <div
          className={cn(
            "mt-0.5 shrink-0 flex items-center",
            isCard ? "gap-1" : "gap-0.5",
          )}
        >
          {Array.from({ length: Math.min(slide.steps, 5) }).map((_, i) => (
            <span
              key={i}
              className={cn("rounded-full", isCard ? "size-2.5" : "size-2")}
              style={{
                backgroundColor:
                  i === Math.floor(slide.steps / 2)
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
          {slide.scaleLabels.left} – {slide.scaleLabels.right}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      <p
        className="text-xl mb-8 text-center max-w-2xl"
        style={{ color: slide.theme.textColor }}
      >
        &quot;{slide.statement}&quot;
      </p>
      <div className="w-full max-w-xl">
        <div className="flex justify-between mb-4">
          {Array.from({ length: slide.steps }).map((_, i) => (
            <button
              key={i}
              className="size-12 rounded-full text-sm font-medium transition-all hover:scale-110"
              style={{
                backgroundColor:
                  i === Math.floor(slide.steps / 2)
                    ? slide.theme.accentColor
                    : slide.theme.textColor + "10",
                color:
                  i === Math.floor(slide.steps / 2)
                    ? "#fff"
                    : slide.theme.textColor,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div
          className="flex justify-between text-sm"
          style={{ color: slide.theme.textColor }}
        >
          <span>{slide.scaleLabels.left}</span>
          <span>{slide.scaleLabels.right}</span>
        </div>
      </div>
    </div>
  );
}



function QAContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: QASlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const sampleQuestions = QA_SAMPLE_QUESTIONS;

  if (isThumbnail) {
    return (
      <div className="flex h-full w-full min-w-0 flex-col items-stretch justify-center gap-0 overflow-hidden px-0.5">
        <h2
          className={cn(
            "shrink-0 line-clamp-1 w-full text-center font-semibold leading-tight",
            isCard ? "text-xs" : "text-[10px]",
          )}
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || "Q&A"}
        </h2>
        <div
          className={cn(
            "mt-0.5 flex w-full min-w-0 flex-col overflow-hidden",
            isCard ? "gap-1" : "gap-0.5",
          )}
        >
          {sampleQuestions.slice(0, 2).map((q, i) => (
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
      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      <div className="flex-1 space-y-3 max-w-xl mx-auto w-full">
        {sampleQuestions.map((q, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl p-4"
            style={{ backgroundColor: slide.theme.textColor + "10" }}
          >
            <button
              className="flex flex-col items-center gap-1 px-2"
              style={{ color: slide.theme.accentColor }}
            >
              <ThumbsUp className="size-4" />
              <span className="text-xs font-medium">{q.upvotes}</span>
            </button>
            <p style={{ color: slide.theme.textColor }}>{q.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PointsContent({
  slide,
  thumbnailSize,
}: {
  thumbnailSize?: ThumbnailSize;
  slide: PointsSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const mockAllocations = slide.items.map(
    (_, i) =>
      Math.floor(slide.totalPoints / slide.items.length) +
      (i === 0 ? slide.totalPoints % slide.items.length : 0),
  );

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
        >
          {slide.title || "100 points"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
        <div
          className={cn(
            "mt-1 w-full max-w-[95%]",
            isCard ? "space-y-1" : "space-y-0.5",
          )}
        >
          {slide.items.slice(0, 3).map((item, index) => (
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
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-lg mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      <div className="w-full max-w-md space-y-4">
        {slide.items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span style={{ color: slide.theme.textColor }}>{item.text}</span>
              <span
                className="font-bold"
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
}: {
  thumbnailSize?: ThumbnailSize;
  slide: WheelSlide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
  const colors = WHEEL_COLORS;
  const segmentAngle = 360 / slide.names.length;

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
        >
          {slide.title || "Wheel of names"}
        </h2>
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
      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
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
}: {
  thumbnailSize?: ThumbnailSize;
  slide: Slide;
}) {
  const isThumbnail = thumbnailSize !== false;
  const isCard = thumbnailSize === "card";
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
        >
          {slide.title || "Slide"}
        </h2>
        {slide.subtitle && (
          <p
            className={cn(
              "line-clamp-1 max-w-full opacity-80",
              isCard ? "text-[10px]" : "text-[8px]",
            )}
            style={{ color: slide.theme.textColor }}
          >
            {slide.subtitle}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || "Slide Title"}
      </h2>
      {slide.subtitle && (
        <p
          className="text-xl opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
    </div>
  );
}
