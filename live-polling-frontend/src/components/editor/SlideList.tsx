import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch } from '@/store/hooks';
import { reorderSlides } from '@/store/presentationsSlice';
import { setSelectedSlide } from '@/store/editorSlice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideListProps } from './types';
import SlideThumbnail from './SlideThumbnail';
import { useReorderSlidesMutation } from "@/api/presentations.api";

export default function SlideList({ slides, selectedSlideId, presentationId, isTemplatePreview }: SlideListProps) {
  const dispatch = useAppDispatch();
  const [reorderSlidesApi] = useReorderSlidesMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sortedSlides = useMemo(() => [...slides].sort((a, b) => a.order - b.order), [slides]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedSlides.findIndex((s) => s.id === active.id);
      const newIndex = sortedSlides.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(sortedSlides, oldIndex, newIndex);
      const slideIds = newOrder.map((s) => s.id);
      
      // Update local state immediately
      dispatch(reorderSlides({ presentationId, slideIds }));
      
      // Update backend only for real (non-template) presentations
      if (!isTemplatePreview) {
        try {
          await reorderSlidesApi({ id: presentationId, slideIds }).unwrap();
        } catch (err) {
          console.error("Failed to reorder slides on backend", err);
        }
      }
    }
  };

  return (
    <ScrollArea className="flex-1">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedSlides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 p-3">
            {sortedSlides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isSelected={slide.id === selectedSlideId}
                onClick={() => dispatch(setSelectedSlide(slide.id))}
                presentationId={presentationId}
                isTemplatePreview={isTemplatePreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </ScrollArea>
  );
}
