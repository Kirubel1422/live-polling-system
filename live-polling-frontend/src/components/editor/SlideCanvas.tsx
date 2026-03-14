import { 
  Slide, 
  MultipleChoiceSlide, 
  OpenEndedSlide, 
  QuizSlide, 
  ContentSlide,
  WordCloudSlide,
  RatingSlide,
  RankingSlide,
  ScalesSlide,
  PinOnImageSlide,
  QASlide,
  ImageChoiceSlide,
  NumberSlide,
  PointsSlide,
  WheelSlide,
} from '@/types/presentation'
import { cn } from '@/lib/utils'
import { Star, ThumbsUp, Image as ImageIcon, Upload } from 'lucide-react'

interface SlideCanvasProps {
  slide: Slide | undefined
  presentationId: string
}

export default function SlideCanvas({ slide }: SlideCanvasProps) {
  if (!slide) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Select a slide to edit</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/20 p-8">
      <div
        className="aspect-video w-full max-w-4xl rounded-lg border shadow-lg overflow-hidden"
        style={{ backgroundColor: slide.theme.backgroundColor }}
      >
        <div className="flex h-full flex-col items-center justify-center p-8">
          {renderSlideContent(slide)}
        </div>
      </div>
    </div>
  )
}

function renderSlideContent(slide: Slide) {
  switch (slide.type) {
    case 'multiple-choice':
      return <MultipleChoiceContent slide={slide} />
    case 'open-ended':
      return <OpenEndedContent slide={slide} />
    case 'quiz':
      return <QuizContent slide={slide} />
    case 'content':
      return <ContentContent slide={slide} />
    case 'word-cloud':
      return <WordCloudContent slide={slide} />
    case 'rating':
      return <RatingContent slide={slide} />
    case 'ranking':
      return <RankingContent slide={slide} />
    case 'scales':
      return <ScalesContent slide={slide} />
    case 'pin-on-image':
      return <PinOnImageContent slide={slide} />
    case 'qa':
      return <QAContent slide={slide} />
    case 'image-choice':
      return <ImageChoiceContent slide={slide} />
    case 'number':
      return <NumberContent slide={slide} />
    case '100-points':
      return <PointsContent slide={slide} />
    case 'wheel-of-names':
      return <WheelContent slide={slide} />
    default:
      return <DefaultContent slide={slide} />
  }
}

function MultipleChoiceContent({ slide }: { slide: MultipleChoiceSlide }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || 'Your question here'}
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
              'flex items-center justify-center rounded-xl p-6 text-lg font-medium text-white transition-transform hover:scale-[1.02]',
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
  )
}

function OpenEndedContent({ slide }: { slide: OpenEndedSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || 'Your question here'}
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
        style={{ borderColor: slide.theme.accentColor + '40' }}
      >
        <p className="text-muted-foreground">
          {slide.placeholder || 'Participants will type their answers here...'}
        </p>
      </div>
    </div>
  )
}

function QuizContent({ slide }: { slide: QuizSlide }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span
          className="rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: slide.theme.accentColor,
            color: '#fff',
          }}
        >
          {slide.points} points
        </span>
        <span
          className="rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: slide.theme.accentColor + '20',
            color: slide.theme.accentColor,
          }}
        >
          {slide.timeLimit}s
        </span>
      </div>
      <div className="mb-6 text-center">
        <h2
          className="text-3xl font-bold"
          style={{ color: slide.theme.textColor }}
        >
          {slide.title || 'Quiz question here'}
        </h2>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {slide.options.map((option, index) => (
          <button
            key={option.id}
            className={cn(
              'flex items-center justify-center rounded-xl p-4 text-base font-medium text-white transition-transform hover:scale-[1.02]',
              option.isCorrect && 'ring-2 ring-white ring-offset-2'
            )}
            style={{ backgroundColor: option.color || slide.theme.accentColor }}
          >
            <span className="mr-2 flex size-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {String.fromCharCode(65 + index)}
            </span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}

function ContentContent({ slide }: { slide: ContentSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || 'Slide Title'}
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
  )
}

function WordCloudContent({ slide }: { slide: WordCloudSlide }) {
  const sampleWords = ['Innovation', 'Teamwork', 'Growth', 'Success', 'Ideas', 'Creativity']
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || 'What comes to mind?'}
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
  )
}

function RatingContent({ slide }: { slide: RatingSlide }) {
  const renderRatingUI = () => {
    switch (slide.ratingType) {
      case 'stars':
        return (
          <div className="flex gap-2">
            {Array.from({ length: slide.maxValue }).map((_, i) => (
              <Star
                key={i}
                className="size-12 cursor-pointer transition-all hover:scale-110"
                style={{ 
                  color: i < 3 ? slide.theme.accentColor : slide.theme.textColor + '30',
                  fill: i < 3 ? slide.theme.accentColor : 'none',
                }}
              />
            ))}
          </div>
        )
      case 'emoji':
        const emojis = ['😡', '😕', '😐', '🙂', '😊']
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
        )
      case 'nps':
        return (
          <div className="flex gap-1">
            {Array.from({ length: 11 }).map((_, i) => (
              <button
                key={i}
                className="size-10 rounded-lg text-sm font-medium transition-all hover:scale-110"
                style={{
                  backgroundColor: i === 7 ? slide.theme.accentColor : slide.theme.textColor + '10',
                  color: i === 7 ? '#fff' : slide.theme.textColor,
                }}
              >
                {i}
              </button>
            ))}
          </div>
        )
      case 'slider':
        return (
          <div className="w-full max-w-md">
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: slide.theme.textColor + '20' }}
            >
              <div
                className="h-full w-3/5 rounded-full transition-all"
                style={{ backgroundColor: slide.theme.accentColor }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm" style={{ color: slide.theme.textColor }}>
              <span>{slide.minLabel || slide.minValue}</span>
              <span>{slide.maxLabel || slide.maxValue}</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex gap-2">
            {Array.from({ length: slide.maxValue - slide.minValue + 1 }).map((_, i) => (
              <button
                key={i}
                className="size-12 rounded-xl text-lg font-medium transition-all hover:scale-110"
                style={{
                  backgroundColor: i === 2 ? slide.theme.accentColor : slide.theme.textColor + '10',
                  color: i === 2 ? '#fff' : slide.theme.textColor,
                }}
              >
                {slide.minValue + i}
              </button>
            ))}
          </div>
        )
    }
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
  )
}

function RankingContent({ slide }: { slide: RankingSlide }) {
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
            style={{ backgroundColor: item.color || slide.theme.accentColor + '20' }}
          >
            <span
              className="flex size-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: slide.theme.accentColor, color: '#fff' }}
            >
              {index + 1}
            </span>
            <span style={{ color: slide.theme.textColor }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScalesContent({ slide }: { slide: ScalesSlide }) {
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
        "{slide.statement}"
      </p>
      <div className="w-full max-w-xl">
        <div className="flex justify-between mb-4">
          {Array.from({ length: slide.steps }).map((_, i) => (
            <button
              key={i}
              className="size-12 rounded-full text-sm font-medium transition-all hover:scale-110"
              style={{
                backgroundColor: i === Math.floor(slide.steps / 2) 
                  ? slide.theme.accentColor 
                  : slide.theme.textColor + '10',
                color: i === Math.floor(slide.steps / 2) ? '#fff' : slide.theme.textColor,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm" style={{ color: slide.theme.textColor }}>
          <span>{slide.scaleLabels.left}</span>
          <span>{slide.scaleLabels.right}</span>
        </div>
      </div>
    </div>
  )
}

function PinOnImageContent({ slide }: { slide: PinOnImageSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title}
      </h2>
      <div 
        className="relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: slide.theme.accentColor + '40', backgroundColor: slide.theme.textColor + '05' }}
      >
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="Pin target" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="size-8" />
            <span>Upload an image</span>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm" style={{ color: slide.theme.textColor + '70' }}>
        {slide.question || 'Click on the image to place your pin'}
      </p>
    </div>
  )
}

function QAContent({ slide }: { slide: QASlide }) {
  const sampleQuestions = [
    { text: 'How will this affect our roadmap?', upvotes: 12 },
    { text: 'When can we expect the next release?', upvotes: 8 },
    { text: 'What are the key metrics for success?', upvotes: 5 },
  ]

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
            style={{ backgroundColor: slide.theme.textColor + '10' }}
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
  )
}

function ImageChoiceContent({ slide }: { slide: ImageChoiceSlide }) {
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
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {slide.options.map((option) => (
          <div
            key={option.id}
            className="aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center"
            style={{ 
              borderColor: option.color || slide.theme.accentColor,
              backgroundColor: slide.theme.textColor + '05',
            }}
          >
            {option.imageUrl ? (
              <img src={option.imageUrl} alt={option.text} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="size-8" />
                <span className="text-sm">{option.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NumberContent({ slide }: { slide: NumberSlide }) {
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
      <div className="flex items-center gap-4">
        <input
          type="number"
          placeholder="0"
          className="w-32 text-center text-4xl font-bold rounded-xl p-4 border-2"
          style={{
            borderColor: slide.theme.accentColor,
            color: slide.theme.textColor,
            backgroundColor: 'transparent',
          }}
          readOnly
        />
        {slide.unit && (
          <span className="text-2xl" style={{ color: slide.theme.textColor }}>
            {slide.unit}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {slide.minValue !== undefined && slide.maxValue !== undefined
          ? `Range: ${slide.minValue} - ${slide.maxValue}`
          : 'Enter any number'}
      </p>
    </div>
  )
}

function PointsContent({ slide }: { slide: PointsSlide }) {
  const mockAllocations = slide.items.map((_, i) => Math.floor(slide.totalPoints / slide.items.length) + (i === 0 ? slide.totalPoints % slide.items.length : 0))
  
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
              style={{ backgroundColor: slide.theme.textColor + '20' }}
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
      <p className="mt-6 text-sm" style={{ color: slide.theme.textColor + '70' }}>
        Total: {slide.totalPoints} points to distribute
      </p>
    </div>
  )
}

function WheelContent({ slide }: { slide: WheelSlide }) {
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308']
  const segmentAngle = 360 / slide.names.length

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
            const startAngle = i * segmentAngle - 90
            const endAngle = (i + 1) * segmentAngle - 90
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const x1 = 150 + 140 * Math.cos(startRad)
            const y1 = 150 + 140 * Math.sin(startRad)
            const x2 = 150 + 140 * Math.cos(endRad)
            const y2 = 150 + 140 * Math.sin(endRad)
            const largeArc = segmentAngle > 180 ? 1 : 0
            const textAngle = startAngle + segmentAngle / 2
            const textRad = (textAngle * Math.PI) / 180
            const textX = 150 + 90 * Math.cos(textRad)
            const textY = 150 + 90 * Math.sin(textRad)

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
                  {name.length > 8 ? name.slice(0, 8) + '...' : name}
                </text>
              </g>
            )
          })}
          <circle cx="150" cy="150" r="20" fill={slide.theme.backgroundColor} stroke={slide.theme.accentColor} strokeWidth="3" />
        </svg>
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
          style={{ color: slide.theme.accentColor }}
        >
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px]" 
            style={{ borderTopColor: slide.theme.accentColor }}
          />
        </div>
      </div>
      <button
        className="mt-6 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
        style={{ backgroundColor: slide.theme.accentColor, color: '#fff' }}
      >
        Spin the Wheel!
      </button>
    </div>
  )
}

function DefaultContent({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ color: slide.theme.textColor }}
      >
        {slide.title || 'Slide Title'}
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
  )
}
