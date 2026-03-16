import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { deleteSlide, duplicateSlide } from '@/store/presentationsSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { SlideThumbnailProps } from './types';
import { renderSlideContent } from './SlideCanvas';

export default function SlideThumbnail({ slide, index, isSelected, onClick, presentationId }: SlideThumbnailProps) {
  const dispatch = useAppDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteSlide({ presentationId, slideId: slide.id }));
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(duplicateSlide({ presentationId, slideId: slide.id }));
  };

  return (
    <div className="relative">
      <span className="absolute left-4 text-sm text-neutral-500">{++index}</span>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group relative border-transparent rounded-2xl h-20 w-3/4 mx-auto border bg-card transition-all',
          isSelected ? 'ring-2 ring-accent/60 overflow-hidden' : 'overflow-hidden hover:border-border',
          isDragging && 'opacity-50',
        )}
        onClick={onClick}
      >
        <div {...attributes} {...listeners} className="flex items-start gap-2 !overflow-hidden">
          <div className="flex-1 cursor-grab">
            <div className="mb-1.5 h-full w-full" style={{ backgroundColor: slide.theme.backgroundColor }}>
              <div className="flex h-20 w-full flex-col items-center justify-center !overflow-hidden p-2 *:min-h-0">
                {renderSlideContent(slide, 'list')}
              </div>
            </div>
            <div className="flex absolute right-0 top-0 items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon-sm" className="size-5 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="size-4" />
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
    </div>
  );
}
