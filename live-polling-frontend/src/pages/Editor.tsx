import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Loader2,
  Play,
  Plus,
  Save,
  Share,
  Wand2,
} from 'lucide-react';
import Lottie from 'lottie-react';

import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import modifying from '../assets/modifying.json';
import {
  SlideList,
  SlideCanvas,
  RightPanel,
  AddSlideMenu,
} from '@/components/editor/components';
import AIGenerationModal from '@/components/ai-generation-modal/AIGenerationModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useEditorState } from '@/components/editor/hooks';
import { Badge } from '@/components/ui/badge';

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
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBackClick: () => void;
  onSaveClick: () => void;
  isSaving?: boolean;
  onEnhanceSubmit: (prompt: string) => void;
  isEnhancing?: boolean;
  enhanceReasoning?: string;
}) {
  const [enhancePrompt, setEnhancePrompt] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-slate-200/70 bg-white/[0.88] px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/90">
      <div className="mx-auto flex max-w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onBackClick}
                className="size-10 rounded-2xl bg-slate-50/80 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.055] dark:text-slate-300 dark:hover:bg-white/[0.08]"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to Dashboard</TooltipContent>
          </Tooltip>

          <div className="hidden h-8 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />

          <Input
            value={title}
            onChange={onTitleChange}
            className="h-11 w-52 rounded-2xl border-slate-200/80 bg-slate-50/80 px-4 text-sm font-black text-slate-700 shadow-none transition-all duration-300 hover:border-primary/35 focus-visible:border-primary focus-visible:ring-primary/20 sm:w-80 dark:border-white/10 dark:bg-white/[0.055] dark:text-white"
          />
        </div>

        {joinCode && (
          <Badge
            variant="outline"
            className="hidden rounded-2xl border-slate-200/70 bg-slate-50/80 px-3 py-2 text-sm font-bold text-slate-600 shadow-none md:inline-flex dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300"
          >
            Join Code:
            <span className="ml-2 rounded-xl bg-primary/10 px-2 py-0.5 font-black text-primary">
              {joinCode}
            </span>
          </Badge>
        )}

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-10 rounded-2xl bg-slate-50/80 text-primary shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
                onClick={() => setModalOpen(true)}
              >
                <Wand2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enhance with AI</TooltipContent>
          </Tooltip>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="rounded-[2rem] border border-slate-200/70 bg-white/[0.95] p-6 shadow-none backdrop-blur-xl sm:max-w-[520px] dark:border-white/10 dark:bg-slate-950/95">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
                  Enhance with AI
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Describe how you want to improve this presentation.
                </DialogDescription>
              </DialogHeader>

              {isEnhancing ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  {enhanceReasoning ? (
                    <ModifyingReview />
                  ) : (
                    <Loader2 className="size-8 animate-spin text-primary" />
                  )}

                  <p className="line-clamp-4 w-full overflow-hidden text-ellipsis break-words text-center text-sm text-primary/80">
                    {enhanceReasoning || 'Thinking...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="e.g. Make it more professional, change theme to dark, or add a quiz slide at the end..."
                    value={enhancePrompt}
                    onChange={(e) => setEnhancePrompt(e.target.value)}
                    className="min-h-[130px] resize-none rounded-[1.5rem] border-slate-200/80 bg-white/70 p-4 text-sm font-medium shadow-none transition-all duration-300 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                  />

                  <Button
                    className="h-12 w-full rounded-2xl bg-primary font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                    onClick={() => {
                      if (enhancePrompt.trim()) {
                        onEnhanceSubmit(enhancePrompt);
                        setEnhancePrompt('');
                      }
                    }}
                    disabled={!enhancePrompt.trim()}
                  >
                    <Wand2 className="mr-2 size-4" />
                    Modify with AI
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-10 rounded-2xl bg-slate-50/80 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.055] dark:text-slate-300 dark:hover:bg-white/[0.08]"
              >
                <Share className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>

          <div className="hidden h-8 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={onSaveClick}
            disabled={isSaving}
            className="h-10 rounded-2xl border-slate-200/80 bg-white/70 px-4 font-black text-slate-600 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            size="sm"
            asChild
            className="h-10 rounded-2xl bg-primary px-4 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Link to={`/preview/${presentationId}`}>
              <Play className="size-4" />
              Present
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ModifyingReview() {
  return (
    <Lottie
      animationData={modifying}
      loop
      autoplay
      style={{ width: 250, height: 250 }}
      className="mx-auto"
    />
  );
}

function EmptySlidePanel({ onAddSlide }: { onAddSlide: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Plus className="size-7 text-primary" />
      </div>

      <p className="mb-1 text-sm font-black text-slate-900 dark:text-white">
        No slides yet
      </p>

      <p className="mb-4 max-w-40 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Add your first slide to start building.
      </p>

      <Button
        size="sm"
        onClick={onAddSlide}
        className="rounded-2xl bg-primary font-black text-white shadow-none hover:bg-primary/90"
      >
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
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200/70 bg-white/[0.72] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
      <div className="border-b border-slate-200/70 p-4 dark:border-white/10">
        <AddSlideMenu presentationId={presentationId} />
      </div>

      {slides.length === 0 ? (
        <EmptySlidePanel onAddSlide={onAddFirstSlide} />
      ) : (
        <SlideList
          slides={slides}
          selectedSlideId={selectedSlideId}
          presentationId={presentationId}
          isTemplatePreview={isTemplatePreview}
        />
      )}
    </aside>
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
    handleAddFirstSlide,
  } = useEditorState();

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#07111f]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!presentation) return null;

  return (
    <div className="relative isolate flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.10),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-70" />
      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute bottom-[10%] right-[12%] -z-10 size-80 rounded-full bg-secondary/14 blur-3xl" />

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

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <SlidePanel
          slides={presentation.slides}
          selectedSlideId={selectedSlideId}
          presentationId={presentation.id}
          isTemplatePreview={isTemplatePreview}
          onAddFirstSlide={handleAddFirstSlide}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <SlideCanvas
            slide={selectedSlide}
            presentationId={presentation.id}
            isPreview={false}
            responses={
              selectedSlide?.type === 'qa'
                ? selectedSlide?.responses || []
                : (selectedSlide?.responses || []).map((r: any) =>
                    r && typeof r === 'object' && 'value' in r ? r.value : r,
                  )
            }
          />
        </div>

        {selectedSlide && (
          <RightPanel
            slide={selectedSlide}
            presentationId={presentation.id}
            isTemplatePreview={isTemplatePreview}
          />
        )}
      </div>

      <AIGenerationModal
        open={isAIModalOpen}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: 'editor/closeAIModal' });
        }}
      />

      <Dialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <DialogContent className="rounded-[2rem] border border-slate-200/70 bg-white/[0.95] p-6 shadow-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
              Unsaved Template
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              To use this template, it must be saved to your presentations. Do
              you want to save it now, or exit without saving?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={handleExitWithoutSaving}
              className="rounded-2xl border-slate-200/80 bg-white/70 font-bold shadow-none hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.055]"
            >
              Exit without saving
            </Button>

            <div className="flex gap-2">
              <Button
                className="rounded-2xl bg-secondary font-black text-white shadow-none hover:bg-secondary/90"
                onClick={() => setShowExitWarning(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveAndExit}
                disabled={isSaving}
                className="rounded-2xl bg-primary font-black text-white shadow-none hover:bg-primary/90"
              >
                {isSaving ? 'Saving...' : 'Save and Exit'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}