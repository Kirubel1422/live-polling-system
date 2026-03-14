import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addPresentation } from '@/store/presentationsSlice'
import {
  closeAIModal,
  setAIGenerationProgress,
  setAIGenerationStatus,
} from '@/store/editorSlice'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  DEFAULT_THEME,
  MultipleChoiceSlide,
  OpenEndedSlide,
  QuizSlide,
  ContentSlide,
  Slide,
} from '@/types/presentation'
import { nanoid } from 'nanoid'

interface AIGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESETS = [
  { id: 'feedback', label: 'Team Feedback', prompt: 'Create a team feedback session' },
  { id: 'quiz', label: 'Fun Quiz', prompt: 'Create a fun trivia quiz' },
  { id: 'brainstorm', label: 'Brainstorming', prompt: 'Create a brainstorming session' },
  { id: 'icebreaker', label: 'Icebreaker', prompt: 'Create team icebreaker questions' },
]

export default function AIGenerationModal({
  open,
  onOpenChange,
}: AIGenerationModalProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { aiGenerationProgress, aiGenerationStatus } = useAppSelector(
    (state) => state.editor
  )
  const presentations = useAppSelector((state) => state.presentations.items)

  const [prompt, setPrompt] = useState('')
  const [slideCount, setSlideCount] = useState([5])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([])

  useEffect(() => {
    if (selectedPreset) {
      const preset = PRESETS.find((p) => p.id === selectedPreset)
      if (preset) {
        setPrompt(preset.prompt)
      }
    }
  }, [selectedPreset])

  const generateMockSlides = async (): Promise<Slide[]> => {
    const slides: Slide[] = []
    const count = slideCount[0]

    // Title slide
    slides.push({
      id: nanoid(),
      type: 'content',
      title: prompt || 'Interactive Presentation',
      subtitle: 'Generated with AI',
      content: 'Welcome to this interactive session!',
      layout: 'center',
      theme: DEFAULT_THEME,
      settings: {},
      order: 0,
    } as ContentSlide)

    // Generate mix of slide types
    for (let i = 1; i < count; i++) {
      const slideTypes = ['multiple-choice', 'open-ended', 'quiz', 'content']
      const type = slideTypes[i % slideTypes.length]

      if (type === 'multiple-choice') {
        slides.push({
          id: nanoid(),
          type: 'multiple-choice',
          title: `Question ${i}: What do you think?`,
          subtitle: 'Select the best option',
          options: [
            { id: nanoid(), text: 'Option A', color: '#6366f1' },
            { id: nanoid(), text: 'Option B', color: '#8b5cf6' },
            { id: nanoid(), text: 'Option C', color: '#a855f7' },
            { id: nanoid(), text: 'Option D', color: '#d946ef' },
          ],
          theme: DEFAULT_THEME,
          settings: { showResults: true },
          order: i,
        } as MultipleChoiceSlide)
      } else if (type === 'open-ended') {
        slides.push({
          id: nanoid(),
          type: 'open-ended',
          title: `Share your thoughts on topic ${i}`,
          subtitle: 'Type your answer below',
          placeholder: 'Enter your response...',
          theme: DEFAULT_THEME,
          settings: { isAnonymous: true },
          order: i,
        } as OpenEndedSlide)
      } else if (type === 'quiz') {
        slides.push({
          id: nanoid(),
          type: 'quiz',
          title: `Quiz: Test your knowledge!`,
          subtitle: 'Select the correct answer',
          options: [
            { id: nanoid(), text: 'Correct Answer', isCorrect: true, color: '#22c55e' },
            { id: nanoid(), text: 'Wrong Answer 1', isCorrect: false, color: '#ef4444' },
            { id: nanoid(), text: 'Wrong Answer 2', isCorrect: false, color: '#f97316' },
            { id: nanoid(), text: 'Wrong Answer 3', isCorrect: false, color: '#eab308' },
          ],
          timeLimit: 30,
          points: 100,
          theme: DEFAULT_THEME,
          settings: { showCorrectAnswer: true },
          order: i,
        } as QuizSlide)
      } else {
        slides.push({
          id: nanoid(),
          type: 'content',
          title: `Key Point ${i}`,
          subtitle: '',
          content: 'This is important information to share with your audience.',
          layout: 'center',
          theme: DEFAULT_THEME,
          settings: {},
          order: i,
        } as ContentSlide)
      }
    }

    return slides
  }

  const handleGenerate = async () => {
    dispatch(setAIGenerationStatus('generating'))
    dispatch(setAIGenerationProgress(0))

    // Simulate AI generation with progress
    const totalSteps = 10
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      dispatch(setAIGenerationProgress((i / totalSteps) * 100))
    }

    const slides = await generateMockSlides()
    setGeneratedSlides(slides)
    dispatch(setAIGenerationStatus('complete'))
  }

  const handleCreatePresentation = () => {
    dispatch(
      addPresentation({
        title: prompt || 'AI Generated Presentation',
        slides: generatedSlides,
        theme: DEFAULT_THEME,
      })
    )

    // Get the newly created presentation ID
    setTimeout(() => {
      const newPresentation = presentations[0]
      if (newPresentation) {
        navigate(`/editor/${newPresentation.id}`)
      }
      dispatch(closeAIModal())
      setPrompt('')
      setSelectedPreset(null)
      setGeneratedSlides([])
    }, 100)
  }

  const handleClose = () => {
    onOpenChange(false)
    dispatch(closeAIModal())
    setPrompt('')
    setSelectedPreset(null)
    setGeneratedSlides([])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Generate with AI
          </DialogTitle>
          <DialogDescription>
            Describe your presentation and let AI create engaging slides for you.
          </DialogDescription>
        </DialogHeader>

        {aiGenerationStatus === 'idle' && (
          <div className="space-y-6">
            {/* Presets */}
            <div className="space-y-3">
              <Label>Quick Start</Label>
              <RadioGroup
                value={selectedPreset || ''}
                onValueChange={setSelectedPreset}
                className="grid grid-cols-2 gap-2"
              >
                {PRESETS.map((preset) => (
                  <div key={preset.id} className="relative">
                    <RadioGroupItem
                      value={preset.id}
                      id={preset.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={preset.id}
                      className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {preset.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe your presentation</Label>
              <Textarea
                id="prompt"
                placeholder="E.g., Create a quiz about world geography with multiple choice questions..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24"
              />
            </div>

            {/* Slide Count */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Number of slides</Label>
                <span className="text-sm text-muted-foreground">{slideCount[0]}</span>
              </div>
              <Slider
                value={slideCount}
                onValueChange={setSlideCount}
                min={3}
                max={15}
                step={1}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full"
            >
              <Sparkles className="size-4" />
              Generate Presentation
            </Button>
          </div>
        )}

        {aiGenerationStatus === 'generating' && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium">Generating your presentation...</p>
                <p className="text-sm text-muted-foreground">
                  Creating {slideCount[0]} engaging slides
                </p>
              </div>
            </div>
            <Progress value={aiGenerationProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {Math.round(aiGenerationProgress)}% complete
            </p>
          </div>
        )}

        {aiGenerationStatus === 'complete' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                <Sparkles className="size-8 text-success" />
              </div>
              <div className="text-center">
                <p className="font-medium">Presentation ready!</p>
                <p className="text-sm text-muted-foreground">
                  {generatedSlides.length} slides generated
                </p>
              </div>
            </div>

            {/* Preview of generated slides */}
            <div className="grid grid-cols-3 gap-2">
              {generatedSlides.slice(0, 6).map((slide, index) => (
                <div
                  key={slide.id}
                  className="aspect-video rounded-md border bg-muted/50 p-2"
                >
                  <p className="text-xs font-medium truncate">{slide.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {slide.type.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreatePresentation} className="flex-1">
                Open in Editor
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
