import { useAppDispatch } from '@/store/hooks';
import {
  closeAIModal,
  setAIGenerationProgress,
  setAIGenerationStatus,
} from '@/store/editorSlice';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { AIGenerationModalProps } from './types';
import { useTypingPlaceholder, useAIModalState } from './hooks';
import { LeftPanel, RightPanel } from './components';

export default function AIGenerationModal({ open, onOpenChange }: AIGenerationModalProps) {
  const dispatch = useAppDispatch();

  const {
    prompt,
    setPrompt,
    chatMessages,
    isThinking,
    thinkingText,
    handleGenerate,
    handleClose,
  } = useAIModalState({
    onDispatchStatus: (s) => dispatch(setAIGenerationStatus(s)),
    onDispatchProgress: (p) => dispatch(setAIGenerationProgress(p)),
    onDispatchClose: () => dispatch(closeAIModal()),
    onOpenChange,
  });

  const placeholderText = useTypingPlaceholder();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90%] rounded-2xl p-7 h-[90%] flex">
        <LeftPanel
          messages={chatMessages}
          isThinking={isThinking}
          thinkingText={thinkingText}
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleGenerate}
          placeholderText={placeholderText}
        />

        <Separator orientation="vertical" className="bg-gray-200" />

        <RightPanel isThinking={isThinking} />
      </DialogContent>
    </Dialog>
  );
}
