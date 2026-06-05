import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui";
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSlide } from '@/store/presentationsSlice';
import { setSelectedSlide } from '@/store/editorSlice';
import { type SlideType, type Slide } from '@/types/presentation';
import { type AddSlideMenuProps } from './types';
import { SLIDE_TEMPLATES } from './data.const';
import { createSlideByType } from './hooks';

export default function AddSlideMenu({ presentationId }: AddSlideMenuProps) {
  const dispatch = useAppDispatch();

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId),
  );

  const selectedSlideId = useAppSelector(
    (state) => state.editor.selectedSlideId,
  );

  const handleAddSlide = (type: SlideType) => {
    const newSlide = createSlideByType(type);

    if (presentation?.theme) {
      newSlide.theme = { ...presentation.theme };
    }

    let insertIndex: number | undefined = undefined;

    if (presentation && selectedSlideId) {
      const currentIndex = presentation.slides.findIndex(
        (s: Slide) => s.id === selectedSlideId,
      );

      if (currentIndex !== -1) {
        insertIndex = currentIndex + 1;
      }
    }

    dispatch(addSlide({ presentationId, slide: newSlide, index: insertIndex }));
    dispatch(setSelectedSlide(newSlide.id));
  };

  const interactiveSlides = SLIDE_TEMPLATES.filter(
    (t) => t.category === 'Interactive',
  );
  const contentSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Content');
  const funSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Fun');

  const renderTemplateGroup = (
    label: string,
    templates: typeof SLIDE_TEMPLATES,
  ) => (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </DropdownMenuLabel>

      {templates.map((template) => (
        <DropdownMenuItem
          key={template.type}
          onClick={() => handleAddSlide(template.type)}
          className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-600 focus:bg-primary/10 focus:text-primary dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <template.icon className="size-4" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-black">{template.label}</span>
            <span className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {template.description}
            </span>
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="h-11 rounded-2xl bg-primary px-5 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90">
          New Slide
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="z-50 ml-2 max-h-[70vh] w-72 overflow-y-auto rounded-2xl border border-slate-200/70 bg-white/[0.95] p-2 shadow-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-black text-slate-900 dark:text-white">
          Choose Slide
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 bg-slate-200/70 dark:bg-white/10" />

        {renderTemplateGroup('Interactive', interactiveSlides)}

        <DropdownMenuSeparator className="my-2 bg-slate-200/70 dark:bg-white/10" />

        {renderTemplateGroup('Content', contentSlides)}

        <DropdownMenuSeparator className="my-2 bg-slate-200/70 dark:bg-white/10" />

        {renderTemplateGroup('Fun', funSlides)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}