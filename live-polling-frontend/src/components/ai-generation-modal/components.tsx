import Lottie from 'lottie-react';
import generating from '../../assets/generating-loading.json';
import idle from '../../assets/idle.json';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MoveUp } from 'lucide-react';
import { useLoadingFact } from './hooks';
import { SUGGESTION_CHIPS } from './data.const';
import type { ChatMessage, SuggestionChip } from './types';

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-xs leading-relaxed shadow-sm">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <img
        src="/main-logo.png"
        alt="AI"
        className="size-6 rounded-full object-contain flex-shrink-0 mt-0.5 bg-muted p-0.5"
      />
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-neutral-200 px-3.5 py-2 text-xs leading-relaxed text-foreground">
        {msg.text}
      </div>
    </div>
  );
}

function extractReadableThoughts(rawText: string) {
  if (!rawText) return [];
  // Remove JSON keys like "title": 
  let text = rawText.replace(/"[a-zA-Z0-9_]+"\s*:\s*/g, '');
  // Replace structural characters with newlines
  text = text.replace(/[{}\[\]",]/g, '\n');
  // Handle literal encoded newlines
  text = text.replace(/\\n/g, '\n');
  
  // Split, trim, filter empty lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== "true" && l !== "false" && l !== "null");
  
  // Return the last 4 lines
  return lines.slice(-4);
}

export function ThinkingBubble({ text }: { text: string }) {
  const displayLines = extractReadableThoughts(text);

  return (
    <div className="flex items-start gap-2">
      <img
        src="/main-logo.png"
        alt="AI"
        className="size-6 rounded-full object-contain flex-shrink-0 mt-0.5 bg-muted p-0.5"
      />
      <div className="rounded-2xl rounded-bl-sm bg-neutral-200 px-3.5 py-2 text-xs text-neutral-500 overflow-hidden">
        {displayLines.length > 0 ? (
          displayLines.map((line, idx) => (
            <div key={idx} className="min-h-[1.2rem] flex items-center">
              {idx === displayLines.length - 1 ? (
                <span className="animate-pulse">{line}</span>
              ) : (
                <span className="opacity-70">{line}</span>
              )}
            </div>
          ))
        ) : (
          <span className="animate-pulse">Thinking...</span>
        )}
      </div>
    </div>
  );
}

export function ChatHistory({
  messages,
  isThinking,
  thinkingText,
}: {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingText: string;
}) {
  if (messages.length === 0 && !isThinking) return null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-4 pr-1 min-h-0">
      <div className="flex flex-col gap-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        {isThinking && <ThinkingBubble text={thinkingText} />}
      </div>
    </div>
  );
}

export function SuggestionChips({
  chips,
  onSelect,
}: {
  chips: SuggestionChip[];
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {chips.map((chip) => (
        <Button
          key={chip.text}
          variant="outline"
          className="hover-rainbow-border text-xs px-3 py-5 text-neutral-500 border-neutral-200 shadow-none hover:bg-neutral-50 cursor-pointer transition-all"
          onClick={() => onSelect(chip.text)}
        >
          <span className="mr-1.5 text-sm">{chip.emoji}</span>
          {chip.text}
        </Button>
      ))}
    </div>
  );
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isThinking,
  isFirstMessage,
  placeholderText,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isThinking: boolean;
  isFirstMessage: boolean;
  placeholderText: string;
}) {
  return (
    <div className="mt-auto px-1">
      {isFirstMessage && (
        <>
          <Label htmlFor="prompt" className="text-sm font-semibold text-neutral-700 block mb-3">
            Describe your presentation
          </Label>
          <SuggestionChips chips={SUGGESTION_CHIPS} onSelect={onChange} />
        </>
      )}
      <div className="space-y-2 relative">
        <Textarea
          id="prompt"
          placeholder={placeholderText}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          className="min-h-32 rounded-3xl resize-none shadow-none p-4 placeholder:text-xs"
        />
        <Button
          className="absolute bottom-2 right-2"
          onClick={onSubmit}
          size="icon-sm"
          disabled={!value.trim() || isThinking}
        >
          <MoveUp />
        </Button>
      </div>
    </div>
  );
}

export function LeftPanel({
  messages,
  isThinking,
  thinkingText,
  prompt,
  setPrompt,
  onSubmit,
  placeholderText,
}: {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingText: string;
  prompt: string;
  setPrompt: (v: string) => void;
  onSubmit: () => void;
  placeholderText: string;
}) {
  const isFirstMessage = messages.length === 0 && !isThinking;

  return (
    <div className="w-1/4 flex flex-col gap-3 overflow-hidden">
      <ChatHistory messages={messages} isThinking={isThinking} thinkingText={thinkingText} />
      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onSubmit={onSubmit}
        isThinking={isThinking}
        isFirstMessage={isFirstMessage}
        placeholderText={placeholderText}
      />
    </div>
  );
}

export function IdlePreview() {
  return (
    <>
      <Lottie
        animationData={idle}
        loop
        autoplay
        style={{ width: 250, height: 250 }}
        className="mx-auto"
      />
      <p className="text-xs text-gray-500 text-center mt-2">Your preview will appear here</p>
    </>
  );
}

export function GeneratingPreview({ factLines, factKey, isReasoning = false }: { factLines: string[]; factKey: string; isReasoning?: boolean }) {
  return (
    <>
      <Lottie
        animationData={generating}
        loop
        autoplay
        style={{ width: 400, height: 400 }}
        className="mx-auto"
      />
      <div className="flex justify-center -mt-4 overflow-hidden px-8 w-full max-w-lg mx-auto h-24">
        {isReasoning ? (
          <div className="text-sm   text-primary/60 text-center w-full opacity-80 flex flex-col items-center justify-start gap-1">
            {factLines.map((line, idx) => (
              <p key={idx} className="truncate w-full max-w-full">
                {idx === factLines.length - 1 ? (
                  <><span className="opacity-100">{line}</span><span className="animate-pulse">_</span></>
                ) : (
                  <span className="opacity-70">{line}</span>
                )}
              </p>
            ))}
          </div>
        ) : (
          <p
            key={factKey}
            className="text-md text-primary font-medium text-center inline-block whitespace-nowrap w-0 overflow-hidden animate-[typing_2.5s_steps(45,end)_forwards]"
          >
            {factLines[0]}
          </p>
        )}
      </div>
    </>
  );
}

export function RightPanel({ isThinking, thinkingText = "" }: { isThinking: boolean; thinkingText?: string }) {
  const loadingFact = useLoadingFact(isThinking);

  const isReasoning = Boolean(thinkingText && thinkingText !== 'Thinking ...');
  const displayLines = isReasoning ? extractReadableThoughts(thinkingText) : [loadingFact];

  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <div className="w-full">
        {!isThinking ? (
          <IdlePreview />
        ) : (
          <GeneratingPreview factLines={displayLines} factKey={isReasoning ? 'reasoning' : loadingFact} isReasoning={isReasoning} />
        )}
      </div>
    </div>
  );
}
