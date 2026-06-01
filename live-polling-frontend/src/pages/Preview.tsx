/** Preview page for presenting a presentation in fullscreen. */
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Monitor,
  MousePointerClick,
  PlayCircle,
  QrCode,
  Radio,
  Smartphone,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Preview() {
  const {
    presentationId,
    presentation,
    currentSlideIndex,
    showPhoneMockup,
    setShowPhoneMockup,
    showQRCode,
    setShowQRCode,
    participants,
    slideResponses,
    presentationUrl,
    currentSlide,
    progress,
    goToPrevSlide,
    goToNextSlide,
    kickParticipant,
    isFullscreen,
    handleToggleFullscreen,
  } = usePreviewHandlers();

  if (!presentation) {
    return (
      <div className="relative isolate flex h-screen items-center justify-center overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.14),transparent_34%)]" />

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/[0.88] px-8 py-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <p className="text-sm font-semibold text-slate-500 dark:text-white/60">
            Presentation not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%),linear-gradient(135deg,#f8fafc,#eef9ff_45%,#f8fafc)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%),linear-gradient(135deg,#07111f,#0b1224_45%,#060b16)]" />
      <div className="premium-grid-preview absolute inset-0 -z-20 opacity-70" />
      <div className="absolute left-[12%] top-[12%] -z-10 size-96 rounded-full bg-primary/14 blur-3xl dark:bg-primary/20" />
      <div className="absolute bottom-[8%] right-[12%] -z-10 size-[30rem] rounded-full bg-secondary/14 blur-3xl dark:bg-secondary/16" />
      <div
        className="absolute left-1/2 top-1/2 -z-10 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
        style={{ animation: "glowPulse 7s ease-in-out infinite" }}
      />

      <header className="relative z-30 border-b border-slate-200/70 bg-white/[0.88] px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.055]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-10 rounded-2xl bg-slate-100/80 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.12] dark:hover:text-secondary"
                  asChild
                >
                  <Link to={`/editor/${presentationId}`}>
                    <X className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exit Preview</TooltipContent>
            </Tooltip>

            <div className="hidden h-8 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />

            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-none hover:bg-primary/10 dark:bg-primary/15 dark:text-green-500 dark:hover:bg-primary/15">
                  <Radio className="mr-1 size-3" />
                  Live Preview
                </Badge>

                {presentation.joinCode && (
                  <Badge className="hidden rounded-full bg-slate-100/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-none hover:bg-slate-100/90 md:inline-flex dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/10">
                    Code
                    <span className="ml-1.5 text-primary dark:text-slate-200">
                      {presentation.joinCode}
                    </span>
                  </Badge>
                )}
              </div>

              <p className="truncate text-sm font-black tracking-[-0.015em] text-slate-900 dark:text-white">
                {presentation.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 rounded-2xl bg-slate-100/80 px-4 text-sm font-bold text-slate-600 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.12] dark:hover:text-secondary"
                >
                  <Users className="size-4" />
                  <span className="hidden sm:inline">
                    {participants.length} participants
                  </span>
                  <span className="sm:hidden">{participants.length}</span>
                </Button>
              </SheetTrigger>

              <SheetContent className="flex flex-col border-l border-slate-200/70 bg-white/[0.96] p-0 text-slate-900 backdrop-blur-2xl dark:border-white/10 dark:bg-[#07111f]/95 dark:text-white">
                <SheetHeader className="border-b border-slate-200/70 px-5 py-5 dark:border-white/10">
                  <SheetTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-secondary">
                      <Users className="size-5" />
                    </div>

                    <div>
                      <p className="text-lg font-black tracking-[-0.02em]">
                        Participants
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-white/45">
                        {participants.length} currently connected
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  {participants.length === 0 ? (
                    <div className="mt-10 rounded-[2rem] border border-dashed border-slate-200/80 bg-slate-50/80 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-secondary">
                        <Wifi className="size-7" />
                      </div>

                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        No participants yet
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-white/45">
                        Share the QR code or join code to invite your audience.
                      </p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 backdrop-blur-xl transition-all duration-300 hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary dark:bg-primary/15 dark:text-secondary">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                              {participant.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-white/40">
                              Connected
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-9 rounded-xl text-red-500 shadow-none transition-all duration-300 hover:bg-red-500/10 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-400/10 dark:hover:text-red-200"
                          onClick={() => kickParticipant(participant.id)}
                          title="Kick Participant"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "size-10 rounded-2xl bg-slate-100/80 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.12] dark:hover:text-secondary",
                    showQRCode &&
                      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
                  )}
                  onClick={() => setShowQRCode(!showQRCode)}
                >
                  <QrCode className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show QR Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "size-10 rounded-2xl bg-slate-100/80 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.12] dark:hover:text-secondary",
                    isFullscreen &&
                      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
                  )}
                  onClick={handleToggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="size-4" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              </TooltipContent>
            </Tooltip>

            <div className="hidden h-8 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />

            <div className="flex items-center rounded-2xl border border-slate-200/70 bg-slate-100/80 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPhoneMockup(false)}
                className={cn(
                  "size-8 rounded-xl text-slate-500 shadow-none transition-all duration-300 hover:bg-transparent hover:text-primary dark:text-slate-300 dark:hover:text-secondary",
                  !showPhoneMockup &&
                    "bg-white text-primary dark:bg-white/15 dark:text-secondary",
                )}
              >
                <Monitor className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPhoneMockup(true)}
                className={cn(
                  "size-8 rounded-xl text-slate-500 shadow-none transition-all duration-300 hover:bg-transparent hover:text-primary dark:text-slate-300 dark:hover:text-secondary",
                  showPhoneMockup &&
                    "bg-white text-primary dark:bg-white/15 dark:text-secondary",
                )}
              >
                <Smartphone className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <div className="relative flex min-w-0 flex-1 flex-col p-5 lg:p-7">
          {showQRCode && (
            <div className="absolute left-8 top-8 z-50 w-[280px] overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/[0.96] p-4 text-slate-900 shadow-none backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-white/10">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-secondary/80 to-transparent" />

              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Join Code
                  </p>
                  <h3 className="mt-1 text-3xl font-black tracking-[0.18em] text-primary dark:text-slate-800">
                    {presentation.joinCode}
                  </h3>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowQRCode(false)}
                  className="size-9 rounded-2xl text-slate-400 shadow-none transition-all duration-300 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3">
                <QRCodeCanvas value={presentationUrl} size={214} level="H" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-center">
                <p className="break-words text-xs font-semibold leading-5 text-slate-500">
                  {presentationUrl}
                </p>
              </div>
            </div>
          )}

          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <div className="absolute inset-0 rounded-[2.5rem] border border-slate-200/70 bg-white/[0.46] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.035]" />
            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

            <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-4">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/[0.72] p-4 backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.06]">
                <div className="absolute -left-20 top-20 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/12" />
                <div className="absolute -bottom-20 right-20 size-80 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/12" />

                <div
                  className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-slate-200/70 p-4 sm:p-6 lg:p-8 dark:border-white/10"
                  style={{
                    backgroundColor: currentSlide?.theme.backgroundColor || "#fff",
                  }}
                >
                  <div className="h-full w-full overflow-hidden rounded-[1rem]">
                    {currentSlide && (
                      <SlideRenderer
                        slide={currentSlide}
                        responses={slideResponses[currentSlide.id] || []}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="mx-auto flex max-w-3xl items-center justify-between rounded-[2rem] border border-slate-200/70 bg-white/[0.88] px-3 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06]">
              <Button
                variant="ghost"
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0}
                className="h-11 rounded-2xl px-4 font-bold text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-secondary"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>

              <div className="flex min-w-[220px] flex-col items-center gap-2 px-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/55">
                  <PlayCircle className="size-4 text-primary dark:text-secondary" />
                  Slide
                  <span className="font-black text-slate-900 dark:text-white">
                    {currentSlideIndex + 1}
                  </span>
                  <span>/</span>
                  <span>{presentation.slides.length}</span>
                </div>

                <Progress
                  value={progress}
                  className="h-1.5 w-full bg-slate-200/80 dark:bg-white/10 [&>div]:bg-secondary"
                />
              </div>

              <Button
                variant="ghost"
                onClick={goToNextSlide}
                disabled={currentSlideIndex === presentation.slides.length - 1}
                className="h-11 rounded-2xl px-4 font-bold text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-secondary"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {showPhoneMockup && (
          <aside className="hidden w-[360px] shrink-0 flex-col items-center justify-center border-l border-slate-200/70 bg-white/[0.58] p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.045] xl:flex">
            <div className="mb-5 text-center">
              <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/[0.78] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-secondary">
                <Smartphone className="size-3.5" />
                Participant View
              </div>

              <p className="text-xs leading-5 text-slate-500 dark:text-white/45">
                Live mobile preview for connected participants.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-primary/15 blur-3xl" />

              <div className="relative rounded-[3rem] border border-slate-300/70 bg-slate-950 p-2 shadow-none dark:border-white/15">
                <div className="rounded-[2.55rem] border border-white/10 bg-black p-1">
                  <div className="overflow-hidden rounded-[2.25rem] bg-white">
                    <div className="relative flex h-8 items-center justify-center bg-slate-950">
                      <div className="absolute left-5 top-1/2 flex -translate-y-1/2 gap-1">
                        <span className="size-1.5 rounded-full bg-red-400" />
                        <span className="size-1.5 rounded-full bg-yellow-400" />
                        <span className="size-1.5 rounded-full bg-green-400" />
                      </div>

                      <div className="h-4 w-20 rounded-full bg-black" />

                      <Wifi className="absolute right-5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
                    </div>

                    <div className="relative h-[500px] w-[240px] overflow-hidden bg-[#1a1a2e] font-sans text-white">
                      <div
                        className="absolute left-0 top-0 flex h-[781px] w-[375px] origin-top-left flex-col"
                        style={{ transform: "scale(0.64)" }}
                      >
                        {currentSlide && <PhoneSlideView slide={currentSlide} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 flex items-center gap-2 text-center text-xs font-medium text-slate-500 dark:text-white/40">
              <MousePointerClick className="size-4 text-primary dark:text-secondary" />
              Participants will interact from their devices
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}

function SlideRenderer({
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

function PhoneSlideView({ slide }: { slide: Slide }) {
  const answer: any = undefined;

  const renderContent = () => {
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
                  className="flex items-center rounded-2xl p-4 text-left font-bold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: option.color || slide.theme.accentColor,
                    color: "#fff",
                  }}
                >
                  <span className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
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

            <Button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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
                readOnly
              />
            </div>

            <Button
              className="mt-4 h-14 w-full rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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
                className="h-12 flex-1 rounded-2xl border-2 bg-black/25 px-4 text-white transition-all focus:outline-none focus:ring-2"
                style={
                  {
                    borderColor: slide.theme.accentColor + "60",
                    "--tw-ring-color": slide.theme.accentColor,
                  } as any
                }
                placeholder="Ask a question..."
                readOnly
              />

              <Button
                className="h-12 rounded-2xl px-6 font-black"
                style={{
                  backgroundColor: slide.theme.accentColor,
                  color: "#fff",
                }}
              >
                Send
              </Button>
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
                  <button key={index}>
                    <svg
                      className="h-12 w-12 opacity-30 transition-all hover:opacity-70"
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
                    className="text-5xl opacity-50 transition-transform hover:opacity-100"
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
                      className="h-12 w-12 rounded-2xl text-lg font-black opacity-80 transition-all"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: slide.theme.textColor,
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              className="mt-4 h-14 w-full rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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
              {Array.from({ length: steps }).map((_, index) => (
                <button
                  key={index}
                  className="size-12 rounded-full text-sm font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: slide.theme.textColor,
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 flex w-full justify-between text-sm font-medium opacity-80">
              <span dangerouslySetInnerHTML={{ __html: leftLabel }} />
              <span dangerouslySetInnerHTML={{ __html: rightLabel }} />
            </div>

            <Button
              className="mt-12 h-14 w-full rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
          </div>
        );
      }

      case "ranking": {
        const listItems = (slide as any).items || (slide as any).options || [];

        return (
          <div className="flex h-full flex-col p-6">
            <h3
              className="mb-2 text-center text-xl font-black leading-tight"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            <p className="mb-6 text-center text-sm font-medium opacity-70">
              Drag and drop to rank items
            </p>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
              {listItems.map((item: any, index: number) => (
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

                  <div className="opacity-50">
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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

            <Button
              className="mt-2 h-14 w-full shrink-0 rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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
              className="h-20 w-full max-w-xs rounded-2xl bg-black/20 text-center text-4xl font-black focus:outline-none focus:ring-4"
              style={
                {
                  "--tw-ring-color": slide.theme.accentColor,
                } as any
              }
              placeholder="0"
              readOnly
            />

            <Button
              className="mt-12 h-14 w-full max-w-xs rounded-2xl text-lg font-black"
              style={{
                backgroundColor: slide.theme.accentColor,
                color: "#fff",
              }}
            >
              Submit
            </Button>
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