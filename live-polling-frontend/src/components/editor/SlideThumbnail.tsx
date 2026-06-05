import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { deleteSlide, duplicateSlide } from '@/store/presentationsSlice';
import { useDeleteSlideMutation, useDuplicateSlideMutation } from '@/api/slides.api';
import { cn } from '@/lib/utils';
import { type SlideThumbnailProps } from './types';
import { renderSlideContent } from './SlideCanvas';

/** UUID v4 regex — slides that exist in the DB always have this format. */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isDbId = (id: string) => UUID_REGEX.test(id);

export default function SlideThumbnail({ slide, index, isSelected, onClick, presentationId, isTemplatePreview }: SlideThumbnailProps) {
  const dispatch = useAppDispatch();
  const [deleteSlideApi] = useDeleteSlideMutation();
  const [duplicateSlideApi] = useDuplicateSlideMutation();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic local update
    dispatch(deleteSlide({ presentationId, slideId: slide.id }));
    // Only call the API if the slide is persisted (has a real UUID) and not in template preview
    if (!isTemplatePreview && isDbId(slide.id)) {
      try {
        await deleteSlideApi({ presentationId, slideId: slide.id }).unwrap();
      } catch (err) {
        console.error('Failed to delete slide', err);
      }
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic local update — inserts immediately after parent, shifting the rest
    dispatch(duplicateSlide({ presentationId, slideId: slide.id }));
    // Only call the API if the slide is persisted (has a real UUID) and not in template preview
    if (!isTemplatePreview && isDbId(slide.id)) {
      try {
        await duplicateSlideApi({ presentationId, slideId: slide.id }).unwrap();
      } catch (err) {
        console.error('Failed to duplicate slide', err);
      }
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-4 text-sm text-neutral-500">{++index}</span>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group relative border-transparent rounded-xl aspect-video w-11/12 mx-auto border bg-card transition-all',
          isSelected ? 'ring-2 ring-accent/60 overflow-hidden' : 'overflow-hidden hover:border-border',
          isDragging && 'opacity-50',
        )}
        onClick={onClick}
      >
        <div {...attributes} {...listeners} className="flex h-full items-start gap-2 !overflow-hidden">
          <div className="flex-1 cursor-grab h-full">
            <div className="h-full w-full" style={{ backgroundColor: slide.theme.backgroundColor }}>
              <div className="flex h-full w-full flex-col items-center justify-center !overflow-hidden p-2 *:min-h-0">
                {renderSlideContent(
                  slide, 
                  'list', 
                  presentationId, 
                  false, 
                  slide?.type === "qa" 
                    ? (slide?.responses || [])
                    : (slide?.responses || []).map((r: any) => (r && typeof r === 'object' && 'value' in r) ? r.value : r)
                )}
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


