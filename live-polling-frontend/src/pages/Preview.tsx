import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Smartphone,
  Monitor,
  Users,
  QrCode,
} from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Slide,
  MultipleChoiceSlide,
  OpenEndedSlide,
  QuizSlide,
  ContentSlide,
} from '@/types/presentation'

export default function Preview() {
  const { presentationId } = useParams<{ presentationId: string }>()
  const navigate = useNavigate()

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId)
  )

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showPhoneMockup, setShowPhoneMockup] = useState(true)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevSlide()
      } else if (e.key === 'Escape') {
        navigate(`/editor/${presentationId}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlideIndex, presentation])

  if (!presentation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Presentation not found</p>
      </div>
    )
  }

  const currentSlide = presentation.slides[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / presentation.slides.length) * 100

  const goToNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
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
          <Badge variant="secondary" className="bg-white/10 text-white/70">
            <Users className="mr-1 size-3" />
            0 participants
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <QrCode className="size-4" />
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
                'text-white/70 hover:text-white hover:bg-transparent',
                !showPhoneMockup && 'bg-white/20 text-white'
              )}
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPhoneMockup(true)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-transparent',
                showPhoneMockup && 'bg-white/20 text-white'
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
        <div className="flex flex-1 flex-col p-6">
          {/* Main Slide */}
          <div className="flex flex-1 items-center justify-center">
            <div
              className="aspect-video w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentSlide?.theme.backgroundColor || '#fff' }}
            >
              {currentSlide && <SlideRenderer slide={currentSlide} />}
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
                    {currentSlide && (
                      <PhoneSlideView slide={currentSlide} />
                    )}
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
  )
}

function SlideRenderer({ slide }: { slide: Slide }) {
  switch (slide.type) {
    case 'multiple-choice':
      return <MultipleChoicePresenter slide={slide as MultipleChoiceSlide} />
    case 'open-ended':
      return <OpenEndedPresenter slide={slide as OpenEndedSlide} />
    case 'quiz':
      return <QuizPresenter slide={slide as QuizSlide} />
    case 'content':
      return <ContentPresenter slide={slide as ContentSlide} />
    default:
      return <DefaultPresenter slide={slide} />
  }
}

function MultipleChoicePresenter({ slide }: { slide: MultipleChoiceSlide }) {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 text-center">
        <h2
          className="text-4xl font-bold mb-2"
          style={{ color: slide.theme.textColor }}
        >
          {slide.title}
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
      <div className="grid flex-1 grid-cols-2 gap-4">
        {slide.options.map((option, index) => (
          <div
            key={option.id}
            className="flex items-center justify-center rounded-2xl p-6 text-xl font-semibold text-white"
            style={{ backgroundColor: option.color }}
          >
            <span className="mr-4 flex size-10 items-center justify-center rounded-full bg-white/20">
              {String.fromCharCode(65 + index)}
            </span>
            {option.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function OpenEndedPresenter({ slide }: { slide: OpenEndedSlide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-xl mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      <div
        className="w-full max-w-2xl rounded-2xl border-2 border-dashed p-12"
        style={{ borderColor: slide.theme.accentColor + '60' }}
      >
        <p className="text-lg text-muted-foreground">
          Waiting for responses...
        </p>
      </div>
    </div>
  )
}

function QuizPresenter({ slide }: { slide: QuizSlide }) {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-4 flex items-center justify-between">
        <Badge
          className="text-base px-4 py-1"
          style={{
            backgroundColor: slide.theme.accentColor,
            color: '#fff',
          }}
        >
          {slide.points} points
        </Badge>
        <Badge
          variant="outline"
          className="text-base px-4 py-1"
          style={{
            borderColor: slide.theme.accentColor,
            color: slide.theme.accentColor,
          }}
        >
          {slide.timeLimit} seconds
        </Badge>
      </div>
      <div className="mb-6 text-center">
        <h2
          className="text-4xl font-bold"
          style={{ color: slide.theme.textColor }}
        >
          {slide.title}
        </h2>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {slide.options.map((option, index) => (
          <div
            key={option.id}
            className="flex items-center justify-center rounded-2xl p-6 text-xl font-semibold text-white"
            style={{ backgroundColor: option.color }}
          >
            <span className="mr-4 flex size-10 items-center justify-center rounded-full bg-white/20">
              {String.fromCharCode(65 + index)}
            </span>
            {option.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentPresenter({ slide }: { slide: ContentSlide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12 text-center">
      <h2
        className="text-5xl font-bold mb-6"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-2xl mb-8 opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <p
          className="text-xl max-w-3xl opacity-80 leading-relaxed"
          style={{ color: slide.theme.textColor }}
        >
          {slide.content}
        </p>
      )}
    </div>
  )
}

function DefaultPresenter({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12 text-center">
      <h2
        className="text-5xl font-bold mb-6"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p
          className="text-2xl opacity-70"
          style={{ color: slide.theme.textColor }}
        >
          {slide.subtitle}
        </p>
      )}
    </div>
  )
}

function PhoneSlideView({ slide }: { slide: Slide }) {
  const renderPhoneContent = () => {
    switch (slide.type) {
      case 'multiple-choice':
      case 'quiz':
        const optionSlide = slide as MultipleChoiceSlide | QuizSlide
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold">
              {slide.title}
            </h3>
            <div className="flex flex-1 flex-col gap-2">
              {optionSlide.options.map((option, index) => (
                <button
                  key={option.id}
                  className="flex items-center rounded-lg p-3 text-left text-xs font-medium text-white"
                  style={{ backgroundColor: option.color }}
                >
                  <span className="mr-2 flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                </button>
              ))}
            </div>
            <Button className="mt-4 w-full" size="sm">
              Submit
            </Button>
          </div>
        )

      case 'open-ended':
        return (
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-4 text-center text-sm font-semibold">
              {slide.title}
            </h3>
            <div className="flex-1">
              <textarea
                className="h-32 w-full rounded-lg border p-3 text-sm"
                placeholder={(slide as OpenEndedSlide).placeholder}
              />
            </div>
            <Button className="mt-4 w-full" size="sm">
              Submit
            </Button>
          </div>
        )

      default:
        return (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <h3 className="text-sm font-semibold">{slide.title}</h3>
            {slide.subtitle && (
              <p className="mt-2 text-xs text-muted-foreground">
                {slide.subtitle}
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <div
      className="h-full"
      style={{ backgroundColor: slide.theme.backgroundColor }}
    >
      {renderPhoneContent()}
    </div>
  )
}
