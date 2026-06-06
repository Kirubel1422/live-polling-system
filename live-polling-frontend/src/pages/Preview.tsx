import { Button, Progress, Badge, Tooltip, TooltipContent, TooltipTrigger, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui";
/** Preview page for presenting a presentation in fullscreen. */
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import { usePreviewHandlers, SlideRenderer, PhoneSlideView } from "@/components/preview";

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

  const [mockResponses, setMockResponses] = useState<Record<string, any[]>>({});

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
                        responses={[
                          ...(slideResponses[currentSlide.id] || []),
                          ...(mockResponses[currentSlide.id] || []),
                        ]}
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
                        {currentSlide && (
                          <PhoneSlideView
                            slide={currentSlide}
                            onSubmit={(val) => {
                              setMockResponses((prev) => ({
                                ...prev,
                                [currentSlide.id]: [
                                  ...(prev[currentSlide.id] || []),
                                  val,
                                ],
                              }));
                            }}
                          />
                        )}
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

