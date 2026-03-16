import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Play, Save, Settings, Share, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedSlide } from '@/store/editorSlice';
import { addSlide, updatePresentation } from '@/store/presentationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DEFAULT_THEME, ContentSlide } from '@/types/presentation';
import { nanoid } from 'nanoid';
import { SlideList, SlideCanvas, RightPanel, AddSlideMenu } from '@/components/editor/components';
import AIGenerationModal from '@/components/ai-generation-modal/AIGenerationModal';

function EditorToolbar({
  title,
  presentationId,
  onTitleChange,
}: {
  title: string;
  presentationId: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <header className="flex h-14 items-center bg-background justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link to="/"><ChevronLeft className="size-4" /></Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to Dashboard</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <Input
          value={title}
          onChange={onTitleChange}
          className="h-8 w-64 border-transparent bg-transparent px-2 text-sm text-gray-500 font-medium hover:border-input focus:border-input shadow-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm"><Settings className="size-4" /></Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm"><Share className="size-4" /></Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="sm">
          <Save className="size-4" />
          Save
        </Button>
        <Button size="sm" asChild>
          <Link to={`/preview/${presentationId}`}>
            <Play className="size-4" />
            Present
          </Link>
        </Button>
      </div>
    </header>
  );
}

function EmptySlidePanel({ onAddSlide }: { onAddSlide: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <p className="mb-3 text-center text-sm text-muted-foreground">No slides yet</p>
      <Button size="sm" onClick={onAddSlide}>
        <Plus className="size-4" />
        Add Slide
      </Button>
    </div>
  );
}

function SlidePanel({
  slides,
  selectedSlideId,
  presentationId,
  onAddFirstSlide,
}: {
  slides: any[];
  selectedSlideId: string | null;
  presentationId: string;
  onAddFirstSlide: () => void;
}) {
  return (
    <div className="flex w-64 pt-3 flex-col">
      <div className="flex mr-auto pl-10">
        <AddSlideMenu presentationId={presentationId} />
      </div>
      {slides.length === 0 ? (
        <EmptySlidePanel onAddSlide={onAddFirstSlide} />
      ) : (
        <SlideList slides={slides} selectedSlideId={selectedSlideId} presentationId={presentationId} />
      )}
    </div>
  );
}

export default function Editor() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId),
  );
  const selectedSlideId = useAppSelector((state) => state.editor.selectedSlideId);
  const isAIModalOpen = useAppSelector((state) => state.editor.isAIModalOpen);

  const selectedSlide = presentation?.slides.find((s) => s.id === selectedSlideId);

  useEffect(() => {
    if (presentation && presentation.slides.length > 0 && !selectedSlideId) {
      dispatch(setSelectedSlide(presentation.slides[0].id));
    }
  }, [presentation, selectedSlideId, dispatch]);

  useEffect(() => {
    if (!presentation && presentationId) navigate('/');
  }, [presentation, presentationId, navigate]);

  if (!presentation) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePresentation({ id: presentation.id, updates: { title: e.target.value } }));
  };

  const handleAddFirstSlide = () => {
    const newSlide: ContentSlide = {
      id: nanoid(),
      type: 'content',
      title: 'Welcome',
      subtitle: 'Click to edit',
      content: 'Start adding content to your presentation',
      layout: 'center',
      theme: presentation.theme || DEFAULT_THEME,
      settings: {},
      order: 0,
    };
    dispatch(addSlide({ presentationId: presentation.id, slide: newSlide }));
    dispatch(setSelectedSlide(newSlide.id));
  };

  return (
    <div className="flex h-screen flex-col bg-[#eeeeee]">
      <EditorToolbar
        title={presentation.title}
        presentationId={presentation.id}
        onTitleChange={handleTitleChange}
      />

      <div className="flex flex-1 overflow-x-hidden">
        <SlidePanel
          slides={presentation.slides}
          selectedSlideId={selectedSlideId}
          presentationId={presentation.id}
          onAddFirstSlide={handleAddFirstSlide}
        />

        <div className="flex flex-1 flex-col">
          <SlideCanvas slide={selectedSlide} presentationId={presentation.id} />
        </div>

        {selectedSlide && (
          <RightPanel slide={selectedSlide} presentationId={presentation.id} />
        )}
      </div>

      <AIGenerationModal
        open={isAIModalOpen}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: 'editor/closeAIModal' });
        }}
      />
    </div>
  );
}
