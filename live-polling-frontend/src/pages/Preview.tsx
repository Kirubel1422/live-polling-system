/** Preview page for presenting a presentation in fullscreen. */
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Smartphone,
  Monitor,
  Users,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Slide } from "@/types/presentation";
import { renderSlideContent } from "@/components/editor/SlideCanvas";
import { QRCodeCanvas } from "qrcode.react";
import { usePreviewHandlers } from "@/components/preview";

export default function Preview() {
  const {
    presentationId,
    presentation,
    currentSlideIndex,
    showPhoneMockup,
    setShowPhoneMockup,
    showQRCode,
    setShowQRCode,
    participantsCount,
    slideResponses,
    presentationUrl,
    currentSlide,
    progress,
    goToNextSlide,
    goToPrevSlide,
  } = usePreviewHandlers();

  if (!presentation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Presentation not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#1a1a2e]">
      {/* Top Bar */}
      <header className="flex h-12 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <Link to={`/editor/${presentationId}`}>
                  <X className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exit Preview</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-5 bg-white/20" />
          <span className="text-sm text-white/70">{presentation.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/10 text-white/70 dark:bg-black">
            <Users className="mr-1 size-3" />{participantsCount} participants
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white/70"
                onClick={() => setShowQRCode(!showQRCode)}
              >
                <QrCode className="size-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show QR Code</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-5 bg-white/20" />
          <div className="flex items-center rounded-md bg-white/10 p-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPhoneMockup(false)}
              className={cn(
                "text-white/70 hover:text-white hover:bg-transparent",
                !showPhoneMockup && "bg-white/20 text-white",
              )}
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPhoneMockup(true)}
              className={cn(
                "text-white/70 hover:text-white hover:bg-transparent",
                showPhoneMockup && "bg-white/20 text-white",
              )}
            >
              <Smartphone className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Presenter View */}
        <div className="flex flex-1 flex-col p-6 relative">
          
          {/* QR Code Floating Widget */}
          {showQRCode && (
            <div className="absolute top-10 left-10 z-50 flex flex-col items-center p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between w-full items-center mb-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Join Code</span>
                  <h3 className="text-xl font-black text-primary tracking-widest">{presentation.joinCode}</h3>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowQRCode(false)} className="h-8 w-8 hover:bg-gray-100 rounded-full">
                  <X className="size-4 text-gray-500" />
                </Button>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <QRCodeCanvas value={presentationUrl} size={160} level="H" />
              </div>
              <p className="mt-4 text-xs font-medium text-gray-500 max-w-[180px] text-center break-words">{presentationUrl}</p>
            </div>
          )}

          {/* Main Slide */}
          <div className="flex flex-1 items-center justify-center">
              <div
                className="h-full w-full rounded-xl shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: currentSlide?.theme.backgroundColor || "#fff",
                }}
              >
                {currentSlide && <SlideRenderer slide={currentSlide} responses={slideResponses[currentSlide.id] || []} />}
              </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-white/70">
                {currentSlideIndex + 1} / {presentation.slides.length}
              </span>
              <Progress value={progress} className="h-1 w-48 bg-white/10" />
            </div>

            <Button
              variant="ghost"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === presentation.slides.length - 1}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Phone Mockup */}
        {showPhoneMockup && (
          <div className="flex w-80 flex-col items-center justify-center border-l border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-xs text-white/50">Participant View</p>
            <div className="relative">
              {/* Phone Frame */}
              <div className="rounded-[2.5rem] border-4 border-gray-800 bg-gray-800 p-2 shadow-xl">
                <div className="rounded-[2rem] overflow-hidden bg-white">
                  {/* Notch */}
                  <div className="flex h-6 items-center justify-center bg-gray-800">
                    <div className="h-4 w-20 rounded-full bg-black" />
                  </div>
                  {/* Screen Content */}
                  <div className="h-[500px] w-[240px] overflow-hidden">
                    {currentSlide && <PhoneSlideView slide={currentSlide} />}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-white/40">
              Participants will see this view on their devices
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

function SlideRenderer({ slide, responses }: { slide: Slide; responses: any[] }) {
  return <>{renderSlideContent(slide, false, undefined, true, responses)}</>;
}

function PhoneSlideView({ slide }: { slide: Slide }) {
  const renderPhoneContent = () => {
    switch (slide.type) {
      case "multiple-choice":
      case "quiz":
      case "image-choice":
        const optionSlide = slide as any;
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {optionSlide.options?.map((option: any, index: number) => (
                <button
                  key={option.id}
                  className="flex items-center rounded-lg p-3 text-left text-xs font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: option.color || slide.theme.accentColor }}
                >
                  <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text || `Option ${index + 1}`}
                </button>
              ))}
            </div>
            <Button className="mt-4 w-full shrink-0" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>
              Submit
            </Button>
          </div>
        );

      case "open-ended":
      case "word-cloud":
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex-1">
              <textarea
                className="h-32 w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.1)", 
                  borderColor: slide.theme.accentColor + "40", 
                  color: slide.theme.textColor,
                  '--tw-ring-color': slide.theme.accentColor 
                } as any}
                placeholder={(slide as any).placeholder || "Type your answer..."}
              />
            </div>
            <Button className="mt-4 w-full" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>
              Submit
            </Button>
          </div>
        );

      case "rating":
        const meta = (slide as any).meta || {};
        const ratingType = (slide as any).ratingType || meta.ratingType || "stars";
        const maxValue = (slide as any).maxValue ?? meta.maxValue ?? 5;
        const minValue = (slide as any).minValue ?? meta.minValue ?? 1;
        const maxLabel = (slide as any).maxLabel || meta.maxLabel;
        const minLabel = (slide as any).minLabel || meta.minLabel;

        const renderMobileRating = () => {
          switch (ratingType) {
            case "stars":
              return (
                <div className="flex gap-2 mb-8">
                  {Array.from({ length: maxValue }).map((_, i) => (
                    <svg key={i} className="w-8 h-8 opacity-40 hover:opacity-100 transition-opacity" style={{ color: slide.theme.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              );
            case "emoji":
              const emojis = ["😡", "😕", "😐", "🙂", "😊"];
              return (
                <div className="flex gap-2 mb-8">
                  {emojis.slice(0, maxValue).map((emoji, i) => (
                    <button key={i} className="text-2xl transition-transform hover:scale-125">{emoji}</button>
                  ))}
                </div>
              );
            case "nps":
              return (
                <div className="flex gap-1 flex-wrap justify-center mb-8">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button key={i} className="w-8 h-8 rounded text-xs font-medium" style={{ backgroundColor: slide.theme.textColor + "10", color: slide.theme.textColor }}>{i}</button>
                  ))}
                </div>
              );
            case "slider":
              return (
                <div className="w-full mb-8">
                  <input type="range" className="w-full accent-current" style={{ color: slide.theme.accentColor }} min={minValue} max={maxValue} defaultValue={Math.floor((minValue + maxValue) / 2)} />
                  <div className="flex justify-between w-full mt-2 text-[10px] opacity-70">
                    <span>{minLabel || minValue}</span>
                    <span>{maxLabel || maxValue}</span>
                  </div>
                </div>
              );
            default:
              return (
                <div className="flex gap-2 mb-8">
                  {Array.from({ length: maxValue - minValue + 1 }).map((_, i) => (
                    <button key={i} className="w-10 h-10 rounded-lg text-sm font-medium" style={{ backgroundColor: slide.theme.textColor + "10", color: slide.theme.textColor }}>{minValue + i}</button>
                  ))}
                </div>
              );
          }
        };

        return (
          <div className="flex h-full flex-col p-4 items-center justify-center text-center">
            <h3 className="mb-8 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            {renderMobileRating()}
            <Button className="mt-4 w-full" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>Submit</Button>
          </div>
        );

      case "scales":
        const scalesMeta = (slide as any).meta || {};
        const steps = (slide as any).steps ?? scalesMeta.steps ?? 5;
        const scalesLabels = (slide as any).scaleLabels || scalesMeta.scaleLabels;
        const scalesLeftLabel = Array.isArray(scalesLabels) ? scalesLabels[0] : scalesLabels?.left || "Strongly Disagree";
        const scalesRightLabel = Array.isArray(scalesLabels) ? scalesLabels[scalesLabels.length - 1] : scalesLabels?.right || "Strongly Agree";

        return (
          <div className="flex h-full flex-col p-4 items-center justify-center text-center">
            <h3 className="mb-8 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex justify-between w-full mb-4 gap-1">
              {Array.from({ length: steps }).map((_, i) => (
                <button
                  key={i}
                  className="size-8 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: i + 1 === Math.floor(steps / 2) + 1 ? slide.theme.accentColor : "rgba(255,255,255,0.1)",
                    color: i + 1 === Math.floor(steps / 2) + 1 ? "#fff" : slide.theme.textColor,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-between w-full mt-2 text-[10px] opacity-70">
              <span>{scalesLeftLabel}</span>
              <span>{scalesRightLabel}</span>
            </div>
            <Button className="mt-8 w-full" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>Submit</Button>
          </div>
        );

      case "ranking":
      case "100-points":
        const listSlide = slide as any;
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {(listSlide.items || listSlide.options)?.map((item: any, i: number) => (
                <div key={item.id || i} className="flex items-center p-3 rounded border" style={{ borderColor: slide.theme.accentColor + "40", backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex-1 text-xs">{item.text || `Item ${i+1}`}</div>
                  <div className="w-12 h-6 rounded bg-black/20 flex items-center justify-center text-[10px]">
                    {slide.type === "100-points" ? "0" : `#${i+1}`}
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full shrink-0" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>Submit</Button>
          </div>
        );

      case "number":
        return (
          <div className="flex h-full flex-col p-4 items-center justify-center">
            <h3 className="mb-6 text-center text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <input type="number" className="w-full text-center text-2xl p-4 rounded-lg border-2 focus:outline-none" style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: slide.theme.accentColor, color: slide.theme.textColor }} placeholder="0" />
            <Button className="mt-8 w-full" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>Submit</Button>
          </div>
        );
        
      case "qa":
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <textarea className="w-full h-20 p-2 text-xs rounded border mb-4 focus:outline-none" style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: slide.theme.accentColor + "40", color: slide.theme.textColor }} placeholder="Ask a question..." />
            <Button className="w-full mb-4 shrink-0" size="sm" style={{ backgroundColor: slide.theme.accentColor, color: "#fff" }}>Submit Question</Button>
            <div className="flex-1 border-t pt-4 overflow-y-auto" style={{ borderColor: slide.theme.textColor + "20" }}>
              <p className="text-[10px] text-center opacity-50">No questions asked yet.</p>
            </div>
          </div>
        );
        
      case "wheel-of-names":
        return (
          <div className="flex h-full flex-col p-4 items-center justify-center text-center">
            <h3 className="mb-8 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: slide.title }} />
            <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center mb-8" style={{ borderColor: slide.theme.accentColor, backgroundColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-[10px] opacity-70">Waiting for spin...</span>
            </div>
          </div>
        );

      case "content":
      case "pin-on-image":
      default:
        return (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <h3 className="text-sm font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: slide.title }} />
            {slide.subtitle && (
              <p className="mt-3 text-[11px] opacity-80" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />
            )}
            {(slide as any).content && (
              <p className="mt-4 text-[10px] opacity-60 line-clamp-6" dangerouslySetInnerHTML={{ __html: (slide as any).content }} />
            )}
          </div>
        );
    }
  };

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ backgroundColor: slide.theme.backgroundColor, color: slide.theme.textColor }}
    >
      {renderPhoneContent()}
    </div>
  );
}
