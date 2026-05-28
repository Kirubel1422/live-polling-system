import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Play, Save, Settings, Share, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedSlide } from '@/store/editorSlice';
import { addPresentation, addSlide, updatePresentation, deletePresentation } from '@/store/presentationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DEFAULT_THEME, ContentSlide } from '@/types/presentation';
import { nanoid } from 'nanoid';
import { SlideList, SlideCanvas, RightPanel, AddSlideMenu } from '@/components/editor/components';
import AIGenerationModal from '@/components/ai-generation-modal/AIGenerationModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreatePresentationMutation, useLazyGetPresentationQuery, useUpdatePresentationMutation } from "@/api/presentations.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function EditorToolbar({
  title,
  presentationId,
  onTitleChange,
  onBackClick,
  onSaveClick,
  isSaving,
}: {
  title: string;
  presentationId: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackClick: () => void;
  onSaveClick: () => void;
  isSaving?: boolean;
}) {
  return (
    <header className="flex h-14 items-center bg-background justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onBackClick}>
              <ChevronLeft className="size-4" />
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
        <Button variant="outline" size="sm" onClick={onSaveClick} disabled={isSaving}>
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save"}
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
  isTemplatePreview,
  onAddFirstSlide,
}: {
  slides: any[];
  selectedSlideId: string | null;
  presentationId: string;
  isTemplatePreview: boolean;
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
        <SlideList slides={slides} selectedSlideId={selectedSlideId} presentationId={presentationId} isTemplatePreview={isTemplatePreview} />
      )}
    </div>
  );
}

export default function Editor() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createPresentation, { isLoading: isSaving }] = useCreatePresentationMutation();
  const [updatePresentationApi] = useUpdatePresentationMutation();
  const [getPresentationById] = useLazyGetPresentationQuery();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstRender = useRef(true);

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
    if (!presentation && presentationId) {
      // If it's a template preview, it should have been put into Redux by Dashboard.
      if (presentationId.startsWith('template-')) {
        navigate('/');
        return;
      }
      
      // Fetch from API if missing from Redux
      setIsFetching(true);
      getPresentationById(presentationId)
        .unwrap()
        .then((data) => {
          dispatch(addPresentation(data));
        })
        .catch(() => {
          toast.error("Presentation not found");
          navigate('/');
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [presentation, presentationId, getPresentationById, dispatch, navigate]);

  const isTemplatePreview = presentationId?.startsWith('template-') || false;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (presentation && !isTemplatePreview) {
      const handler = setTimeout(() => {
        updatePresentationApi({ id: presentation.id, data: { title: presentation.title } }).catch(console.error);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [presentation?.title, presentation?.id, isTemplatePreview, updatePresentationApi]);

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eeeeee]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!presentation) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePresentation({ id: presentation.id, updates: { title: e.target.value } }));
  };

  const handleBackClick = () => {
    if (isTemplatePreview) {
      setShowExitWarning(true);
    } else {
      navigate('/');
    }
  };

  const handleSaveClick = async () => {
    if (isTemplatePreview) {
      try {
        const { id, isTemplatePreview: _, ...presentationData } = presentation as any;
        const newPresentation = await createPresentation(presentationData).unwrap();
        dispatch(deletePresentation(presentation.id));
        dispatch(addPresentation(newPresentation));
        toast.success("Template saved as your presentation!");
        navigate(`/editor/${newPresentation.id}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to save presentation");
      }
    } else {
      // Logic to save an existing presentation if needed
      toast.success("Saved successfully");
    }
  };

  const handleExitWithoutSaving = () => {
    dispatch(deletePresentation(presentation.id));
    setShowExitWarning(false);
    navigate('/');
  };

  const handleSaveAndExit = async () => {
    await handleSaveClick();
    navigate('/');
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
        onBackClick={handleBackClick}
        onSaveClick={handleSaveClick}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-x-hidden">
        <SlidePanel
          slides={presentation.slides}
          selectedSlideId={selectedSlideId}
          presentationId={presentation.id}
          isTemplatePreview={isTemplatePreview}
          onAddFirstSlide={handleAddFirstSlide}
        />

        <div className="flex flex-1 flex-col">
          <SlideCanvas slide={selectedSlide} presentationId={presentation.id} />
        </div>

        {selectedSlide && (
          <RightPanel slide={selectedSlide} presentationId={presentation.id} isTemplatePreview={isTemplatePreview} />
        )}
      </div>

      <AIGenerationModal
        open={isAIModalOpen}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: 'editor/closeAIModal' });
        }}
      />

      <Dialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Template</DialogTitle>
            <DialogDescription>
              To use this template, it must be saved to your presentations. Do you want to save it now, or exit without saving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row sm:justify-between gap-2 mt-4">
            <Button variant="outline" onClick={handleExitWithoutSaving}>
              Exit without saving
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowExitWarning(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAndExit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save and Exit"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
