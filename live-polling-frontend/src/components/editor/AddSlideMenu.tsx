import {
  CheckSquare,
  MessageSquare,
  HelpCircle,
  FileText,
  Plus,
  Cloud,
  Star,
  ListOrdered,
  Sliders,
  MapPin,
  MessageCircle,
  Images,
  Hash,
  PieChart,
  CircleDot,
} from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { addSlide } from '@/store/presentationsSlice'
import { setSelectedSlide } from '@/store/editorSlice'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  DEFAULT_THEME,
  SlideType,
  Slide,
} from '@/types/presentation'
import { nanoid } from 'nanoid'

interface AddSlideMenuProps {
  presentationId: string
}

const SLIDE_TEMPLATES = [
  // Interactive
  {
    type: 'multiple-choice' as SlideType,
    label: 'Multiple Choice',
    description: 'Let participants choose',
    icon: CheckSquare,
    category: 'Interactive',
  },
  {
    type: 'open-ended' as SlideType,
    label: 'Open Ended',
    description: 'Collect text responses',
    icon: MessageSquare,
    category: 'Interactive',
  },
  {
    type: 'quiz' as SlideType,
    label: 'Quiz',
    description: 'Timed quiz question',
    icon: HelpCircle,
    category: 'Interactive',
  },
  {
    type: 'word-cloud' as SlideType,
    label: 'Word Cloud',
    description: 'Visualize responses',
    icon: Cloud,
    category: 'Interactive',
  },
  {
    type: 'rating' as SlideType,
    label: 'Rating Scale',
    description: 'Gather ratings',
    icon: Star,
    category: 'Interactive',
  },
  {
    type: 'ranking' as SlideType,
    label: 'Ranking',
    description: 'Rank items in order',
    icon: ListOrdered,
    category: 'Interactive',
  },
  {
    type: 'scales' as SlideType,
    label: 'Opinion Scale',
    description: 'Likert scale',
    icon: Sliders,
    category: 'Interactive',
  },
  {
    type: 'pin-on-image' as SlideType,
    label: 'Pin on Image',
    description: 'Place pins on image',
    icon: MapPin,
    category: 'Interactive',
  },
  {
    type: 'qa' as SlideType,
    label: 'Q&A',
    description: 'Collect questions',
    icon: MessageCircle,
    category: 'Interactive',
  },
  {
    type: 'image-choice' as SlideType,
    label: 'Image Choice',
    description: 'Choose from images',
    icon: Images,
    category: 'Interactive',
  },
  {
    type: 'number' as SlideType,
    label: 'Number Input',
    description: 'Collect numbers',
    icon: Hash,
    category: 'Interactive',
  },
  {
    type: '100-points' as SlideType,
    label: '100 Points',
    description: 'Distribute points',
    icon: PieChart,
    category: 'Interactive',
  },
  // Content
  {
    type: 'content' as SlideType,
    label: 'Content',
    description: 'Text and images',
    icon: FileText,
    category: 'Content',
  },
  // Fun
  {
    type: 'wheel-of-names' as SlideType,
    label: 'Wheel of Names',
    description: 'Random picker',
    icon: CircleDot,
    category: 'Fun',
  },
]

function createSlideByType(type: SlideType): Slide {
  const baseSlide = {
    id: nanoid(),
    theme: DEFAULT_THEME,
    settings: {},
    order: 0,
  }

  switch (type) {
    case 'multiple-choice':
      return {
        ...baseSlide,
        type: 'multiple-choice',
        title: 'Your question here',
        subtitle: 'Select the best option',
        options: [
          { id: nanoid(), text: 'Option A', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Option C', color: '#a855f7' },
          { id: nanoid(), text: 'Option D', color: '#d946ef' },
        ],
        settings: { showResults: true },
      }

    case 'open-ended':
      return {
        ...baseSlide,
        type: 'open-ended',
        title: 'What do you think?',
        subtitle: 'Share your thoughts',
        placeholder: 'Type your answer here...',
        settings: { isAnonymous: true },
      }

    case 'quiz':
      return {
        ...baseSlide,
        type: 'quiz',
        title: 'Quiz Question',
        subtitle: 'Select the correct answer',
        options: [
          { id: nanoid(), text: 'Correct Answer', isCorrect: true, color: '#22c55e' },
          { id: nanoid(), text: 'Wrong Answer 1', isCorrect: false, color: '#ef4444' },
          { id: nanoid(), text: 'Wrong Answer 2', isCorrect: false, color: '#f97316' },
          { id: nanoid(), text: 'Wrong Answer 3', isCorrect: false, color: '#eab308' },
        ],
        timeLimit: 30,
        points: 100,
        settings: { showCorrectAnswer: true },
      }

    case 'word-cloud':
      return {
        ...baseSlide,
        type: 'word-cloud',
        title: 'What comes to mind?',
        subtitle: 'Enter up to 3 words',
        maxWords: 3,
        profanityFilter: true,
      }

    case 'rating':
      return {
        ...baseSlide,
        type: 'rating',
        title: 'How would you rate this?',
        subtitle: 'Select your rating',
        ratingType: 'stars',
        minValue: 1,
        maxValue: 5,
        minLabel: 'Poor',
        maxLabel: 'Excellent',
      }

    case 'ranking':
      return {
        ...baseSlide,
        type: 'ranking',
        title: 'Rank these items',
        subtitle: 'Drag to reorder',
        items: [
          { id: nanoid(), text: 'First item', color: '#6366f1' },
          { id: nanoid(), text: 'Second item', color: '#8b5cf6' },
          { id: nanoid(), text: 'Third item', color: '#a855f7' },
          { id: nanoid(), text: 'Fourth item', color: '#d946ef' },
        ],
      }

    case 'scales':
      return {
        ...baseSlide,
        type: 'scales',
        title: 'How do you feel about this statement?',
        statement: 'I am satisfied with the current process',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' },
        steps: 5,
      }

    case 'pin-on-image':
      return {
        ...baseSlide,
        type: 'pin-on-image',
        title: 'Where would you place your pin?',
        question: 'Click on the image to place your answer',
        imageUrl: '',
      }

    case 'qa':
      return {
        ...baseSlide,
        type: 'qa',
        title: 'Q&A Session',
        subtitle: 'Submit your questions',
        allowSubmissions: true,
        questions: [],
        settings: { isAnonymous: false, allowUpvotes: true },
      }

    case 'image-choice':
      return {
        ...baseSlide,
        type: 'image-choice',
        title: 'Which do you prefer?',
        subtitle: 'Select an image',
        options: [
          { id: nanoid(), text: 'Option A', imageUrl: '', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', imageUrl: '', color: '#8b5cf6' },
        ],
        settings: { showResults: true },
      }

    case 'number':
      return {
        ...baseSlide,
        type: 'number',
        title: 'Enter a number',
        subtitle: 'What is your guess?',
        minValue: 0,
        maxValue: 100,
        unit: '',
      }

    case '100-points':
      return {
        ...baseSlide,
        type: '100-points',
        title: 'Distribute 100 points',
        subtitle: 'Allocate points based on importance',
        items: [
          { id: nanoid(), text: 'Item A', color: '#6366f1' },
          { id: nanoid(), text: 'Item B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Item C', color: '#a855f7' },
        ],
        totalPoints: 100,
      }

    case 'wheel-of-names':
      return {
        ...baseSlide,
        type: 'wheel-of-names',
        title: 'Wheel of Names',
        subtitle: 'Spin to pick a winner!',
        names: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
      }

    case 'content':
    default:
      return {
        ...baseSlide,
        type: 'content',
        title: 'Slide Title',
        subtitle: 'Optional subtitle',
        content: 'Add your content here',
        layout: 'center',
      }
  }
}

export default function AddSlideMenu({ presentationId }: AddSlideMenuProps) {
  const dispatch = useAppDispatch()

  const handleAddSlide = (type: SlideType) => {
    const newSlide = createSlideByType(type)
    dispatch(addSlide({ presentationId, slide: newSlide }))
    dispatch(setSelectedSlide(newSlide.id))
  }

  const interactiveSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Interactive')
  const contentSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Content')
  const funSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Fun')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel>Add Slide</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Interactive
          </DropdownMenuLabel>
          {interactiveSlides.map((template) => (
            <DropdownMenuItem
              key={template.type}
              onClick={() => handleAddSlide(template.type)}
              className="flex items-start gap-3 py-2"
            >
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Content
          </DropdownMenuLabel>
          {contentSlides.map((template) => (
            <DropdownMenuItem
              key={template.type}
              onClick={() => handleAddSlide(template.type)}
              className="flex items-start gap-3 py-2"
            >
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Fun
          </DropdownMenuLabel>
          {funSlides.map((template) => (
            <DropdownMenuItem
              key={template.type}
              onClick={() => handleAddSlide(template.type)}
              className="flex items-start gap-3 py-2"
            >
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
