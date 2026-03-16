export interface AIGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type ChatRole = 'user' | 'ai';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface Preset {
  id: string;
  label: string;
  prompt: string;
}

export interface SuggestionChip {
  text: string;
  emoji: string;
}

export type AIGenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

export interface AIModalActions {
  onDispatchStatus: (status: AIGenerationStatus) => void;
  onDispatchProgress: (pct: number) => void;
  onDispatchClose: () => void;
  onOpenChange: (open: boolean) => void;
}
