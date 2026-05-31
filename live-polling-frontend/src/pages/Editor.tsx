import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Play, Save, Share, Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import modifying from "../assets/modifying.json"
import { SlideList, SlideCanvas, RightPanel, AddSlideMenu } from '@/components/editor/components';
import AIGenerationModal from '@/components/ai-generation-modal/AIGenerationModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useEditorState } from "@/components/editor/hooks";
import { Loader2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';

function EditorToolbar({
  title,
  presentationId,
  joinCode,
  onTitleChange,
  onBackClick,
  onSaveClick,
  isSaving,
  onEnhanceSubmit,
  isEnhancing,
  enhanceReasoning,
}: {
  title: string;
  presentationId: string;
  joinCode?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackClick: () => void;
  onSaveClick: () => void;
  isSaving?: boolean;
  onEnhanceSubmit: (prompt: string) => void;
  isEnhancing?: boolean;
  enhanceReasoning?: string;
}) {
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
          className="h-8 sm:w-80 border-transparent bg-transparent px-2 text-sm text-gray-500 font-medium hover:border-input focus:border-input shadow-none"
        />
      </div>
      {joinCode && (
        <Badge variant="outline" className='text-md text-neutral-600'>
          Join Code: <span className='bg-neutral-200 px-2 ml-2 rounded-xl text-neutral-900'>{joinCode}</span>
        </Badge>
      )}
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />
         
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setModalOpen(true)}
            >
              <Wand2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Enhance with AI</TooltipContent>
        </Tooltip>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enhance with AI</DialogTitle>
            </DialogHeader>
            {isEnhancing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <ModifyingReview />
                <p className="text-sm text-primary/80 text-center break-words w-full overflow-hidden text-ellipsis line-clamp-4">
                  {enhanceReasoning || "Thinking..."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Textarea
                  placeholder="e.g. Make it more professional, change theme to dark, or add a quiz slide at the end..."
                  value={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.value)}
                  className="resize-none min-h-[120px]"
                />
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (enhancePrompt.trim()) {
                      onEnhanceSubmit(enhancePrompt);
                      setEnhancePrompt("");
                    }
                  }}
                  disabled={!enhancePrompt.trim()}
                >
                  <Wand2 className="size-4 mr-2" /> Modify with AI
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

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

function ModifyingReview() {
  return (
    <>
      <Lottie
        animationData={modifying}
        loop
        autoplay
        style={{ width: 250, height: 250 }}
        className="mx-auto"
      />
    </>
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
  const dispatch = useAppDispatch();
  const {
    showExitWarning,
    setShowExitWarning,
    isFetching,
    isEnhancing,
    enhanceReasoning,
    presentation,
    selectedSlideId,
    isAIModalOpen,
    selectedSlide,
    isTemplatePreview,
    isSaving,
    handleTitleChange,
    handleBackClick,
    handleSaveClick,
    handleExitWithoutSaving,
    handleSaveAndExit,
    handleEnhance,
    handleAddFirstSlide
  } = useEditorState();

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eeeeee]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!presentation) return null;

  return (
    <div className="flex h-screen flex-col bg-[#eeeeee] dark:bg-background">
      <EditorToolbar
        title={presentation.title}
        presentationId={presentation.id}
        joinCode={presentation.joinCode}
        onTitleChange={handleTitleChange}
        onBackClick={handleBackClick}
        onSaveClick={handleSaveClick}
        isSaving={isSaving}
        onEnhanceSubmit={handleEnhance}
        isEnhancing={isEnhancing}
        enhanceReasoning={enhanceReasoning}
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
              <Button className='bg-secondary' onClick={() => setShowExitWarning(false)}>
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
