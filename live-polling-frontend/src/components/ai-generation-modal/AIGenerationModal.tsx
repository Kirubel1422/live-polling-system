import { useAppDispatch } from '@/store/hooks';
import {
  closeAIModal,
  setAIGenerationProgress,
  setAIGenerationStatus,
} from '@/store/editorSlice';

import type { AIGenerationModalProps } from './types';
import { useTypingPlaceholder, useAIModalState } from './hooks';
import { LeftPanel, RightPanel } from './components';
import { Dialog, DialogContent, Separator } from '../ui';

export default function AIGenerationModal({
  open,
  onOpenChange,
}: AIGenerationModalProps) {
  const dispatch = useAppDispatch();

  const {
    prompt,
    setPrompt,
    chatMessages,
    isThinking,
    thinkingText,
    interviewPhase,
    handleGenerate,
    handleInterviewSubmit,
    handleSkipInterview,
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
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[95vw] overflow-hidden rounded-[2rem] border border-slate-200/70 bg-transparent p-0 shadow-none backdrop-blur-xl sm:max-w-[90vw] dark:border-white/10">
        <div className="relative flex min-h-0 w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-[#f4fbff] to-[#eef9ff] dark:from-[#202231] dark:via-[#111827] dark:to-[#06131f]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.16),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_38%)]" />

          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

          <LeftPanel
            messages={chatMessages}
            isThinking={interviewPhase === 'interviewing' ? isThinking : false}
            thinkingText={interviewPhase === 'interviewing' ? thinkingText : ''}
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={interviewPhase === 'interviewing' ? handleInterviewSubmit : handleGenerate}
            onSkip={interviewPhase === 'interviewing' ? handleSkipInterview : undefined}
            placeholderText={placeholderText}
          />

          <Separator
            orientation="vertical"
            className="relative z-10 hidden h-auto bg-slate-200/50 dark:bg-white/8 lg:block"
          />

          <RightPanel 
            isThinking={interviewPhase !== 'interviewing' ? isThinking : false} 
            thinkingText={interviewPhase !== 'interviewing' ? thinkingText : ''} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}