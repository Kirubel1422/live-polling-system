import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addSlide } from '@/store/presentationsSlice';
import { setSelectedSlide } from '@/store/editorSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { SlideType } from '@/types/presentation';
import { AddSlideMenuProps } from './types';
import { SLIDE_TEMPLATES } from './data.const';
import { createSlideByType } from './hooks';





export default function AddSlideMenu({ presentationId }: AddSlideMenuProps) {
  const dispatch = useAppDispatch();

  const handleAddSlide = (type: SlideType) => {
    const newSlide = createSlideByType(type);
    dispatch(addSlide({ presentationId, slide: newSlide }));
    dispatch(setSelectedSlide(newSlide.id));
  };

  const interactiveSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Interactive');
  const contentSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Content');
  const funSlides = SLIDE_TEMPLATES.filter((t) => t.category === 'Fun');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="lg">
          New Slide
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 ml-2 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel>Choose Slide</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Interactive</DropdownMenuLabel>
          {interactiveSlides.map((template) => (
            <DropdownMenuItem key={template.type} onClick={() => handleAddSlide(template.type)} className="flex items-start gap-3 py-2">
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">{template.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Content</DropdownMenuLabel>
          {contentSlides.map((template) => (
            <DropdownMenuItem key={template.type} onClick={() => handleAddSlide(template.type)} className="flex items-start gap-3 py-2">
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">{template.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Fun</DropdownMenuLabel>
          {funSlides.map((template) => (
            <DropdownMenuItem key={template.type} onClick={() => handleAddSlide(template.type)} className="flex items-start gap-3 py-2">
              <template.icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">{template.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
