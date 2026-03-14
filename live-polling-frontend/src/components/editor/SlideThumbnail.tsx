import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { deleteSlide, duplicateSlide } from '@/store/presentationsSlice'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Slide, SLIDE_TYPE_INFO } from '@/types/presentation'

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isSelected: boolean
  onClick: () => void
  presentationId: string
}

export default function SlideThumbnail({
  slide,
  index,
  isSelected,
  onClick,
  presentationId,
}: SlideThumbnailProps) {
  const dispatch = useAppDispatch()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(deleteSlide({ presentationId, slideId: slide.id }))
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(duplicateSlide({ presentationId, slideId: slide.id }))
  }

  const typeInfo = SLIDE_TYPE_INFO[slide.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-card transition-all',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-transparent hover:border-border',
        isDragging && 'opacity-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 p-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-3 text-muted-foreground" />
        </button>

        {/* Thumbnail Preview */}
        <div className="flex-1">
          <div
            className="mb-1.5 aspect-video w-full rounded border"
            style={{ backgroundColor: slide.theme.backgroundColor }}
          >
            <div className="flex h-full flex-col items-center justify-center p-2">
              <p
                className="text-[8px] font-medium leading-tight text-center line-clamp-2"
                style={{ color: slide.theme.textColor }}
              >
                {slide.title || 'Untitled'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {index + 1}. {typeInfo?.label || slide.type}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-5 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
