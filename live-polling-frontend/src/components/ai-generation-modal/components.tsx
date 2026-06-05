import Lottie from 'lottie-react';
import generating from '../../assets/robot.json';
import idle from '../../assets/idle.json';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MoveUp, Sparkles } from 'lucide-react';
import { useLoadingFact } from './hooks';
import { SUGGESTION_CHIPS } from './data.const';
import type { ChatMessage, SuggestionChip } from './types';
import { cn } from '@/lib';

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-xs leading-relaxed text-primary-foreground shadow-none">
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
        className="mt-0.5 size-7 flex-shrink-0 rounded-2xl bg-white/70 object-contain p-1 dark:bg-white/[0.06]"
      />

      <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-slate-200/70 bg-slate-50/80 px-3.5 py-2 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300">
        {msg.text}
      </div>
    </div>
  );
}

function extractReadableThoughts(rawText: string) {
  if (!rawText) return [];

  let text = rawText.replace(/"[a-zA-Z0-9_]+"\s*:\s*/g, '');
  text = text.replace(/[{}\[\]",]/g, '\n');
  text = text.replace(/\\n/g, '\n');

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.length > 0 &&
        l !== 'true' &&
        l !== 'false' &&
        l !== 'null',
    );

  return lines.slice(-4);
}

export function ThinkingBubble({ text }: { text: string }) {
  const displayLines = extractReadableThoughts(text);

  return (
    <div className="flex items-start gap-2">
      <img
        src="/main-logo.png"
        alt="AI"
        className="mt-0.5 size-7 flex-shrink-0 rounded-2xl bg-white/70 object-contain p-1 dark:bg-white/[0.06]"
      />

      <div className="overflow-hidden rounded-2xl rounded-bl-sm border border-slate-200/70 bg-slate-50/80 px-3.5 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-400">
        {displayLines.length > 0 ? (
          displayLines.map((line, idx) => (
            <div key={idx} className="flex min-h-[1.2rem] items-center">
              {idx === displayLines.length - 1 ? (
                <span className="animate-pulse text-primary">{line}</span>
              ) : (
                <span className="opacity-70">{line}</span>
              )}
            </div>
          ))
        ) : (
          <span className="animate-pulse text-primary">Thinking...</span>
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
    <div className="custom-scrollbar flex min-h-0 flex-1 flex-col-reverse gap-4 overflow-y-auto pr-2 pl-1 pb-2">
      {isThinking && <ThinkingBubble text={thinkingText} />}
      {[...messages].reverse().map((msg, i) => (
        <ChatBubble key={i} msg={msg} />
      ))}
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
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.text}
          type="button"
          variant="outline"
          className="h-auto cursor-pointer rounded-2xl border-slate-200/80 bg-white/70 px-3 py-2 text-xs font-bold text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300 dark:hover:bg-white/[0.08]"
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
          <Label
            htmlFor="prompt"
            className="mb-3 block text-sm font-black text-slate-700 dark:text-slate-200"
          >
            Describe your presentation
          </Label>

          <SuggestionChips chips={SUGGESTION_CHIPS} onSelect={onChange} />
        </>
      )}

      <div className="relative">
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
          className="min-h-32 resize-none rounded-[1.5rem] border-slate-200/80 bg-white/70 p-4 pr-12 text-sm font-medium shadow-none transition-all duration-300 placeholder:text-xs placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055] dark:placeholder:text-slate-500"
        />

        <Button
          className="absolute bottom-2.5 right-2.5 size-9 rounded-2xl bg-primary text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          onClick={onSubmit}
          size="icon-sm"
          disabled={!value.trim() || isThinking}
        >
          <MoveUp className="size-4" />
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
  onSkip,
  placeholderText,
}: {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingText: string;
  prompt: string;
  setPrompt: (v: string) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  placeholderText: string;
}) {
  const isFirstMessage = messages.length === 0 && !isThinking;
  const hasAIMessage = messages.some((m) => m.role === 'ai');

  return (
    <div className="relative z-10 flex min-h-0 w-full flex-col gap-4 overflow-hidden bg-white/[0.34] p-5 backdrop-blur-xl lg:w-[32%] dark:bg-white/[0.035]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/[0.56] p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055]">
        <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-secondary">
          <Sparkles className="size-3.5" />
          AI Assistant
        </div>

        <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
          Generate with AI
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Tell the assistant what kind of interactive presentation you want to
          create.
        </p>
      </div>

      <ChatHistory
        messages={messages}
        isThinking={isThinking}
        thinkingText={thinkingText}
      />

      {onSkip && hasAIMessage && !isThinking && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="h-auto self-end px-2 py-1 text-xs text-slate-400 hover:text-primary"
        >
          Skip — generate now →
        </Button>
      )}

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
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-[2rem] border border-slate-200/50 bg-white/35 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        <Lottie
          animationData={idle}
          loop
          autoplay
          style={{ width: 250, height: 250 }}
          className="mx-auto"
        />
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Your preview will appear here
      </p>
    </div>
  );
}

export function GeneratingPreview({
  factLines,
  factKey,
  isReasoning = false,
}: {
  factLines: string[];
  factKey: string;
  isReasoning?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("p-4", !isReasoning && "dark:bg-white/[0.04] rounded-[2rem] bg-white/60 backdrop-blur-xl")}>
        <Lottie
          animationData={generating}
          loop
          autoplay
          style={{ width: 400, height: 400 }}
          className="mx-auto"
        />
      </div>

      <div className="mt-6 flex h-24 w-full max-w-lg justify-center overflow-hidden px-8">
        {isReasoning ? (
          <div className="flex w-full flex-col items-center justify-start gap-1 text-center text-sm text-primary/70">
            {factLines.map((line, idx) => (
              <p key={idx} className="w-full max-w-full truncate">
                {idx === factLines.length - 1 ? (
                  <>
                    <span className="opacity-100">{line}</span>
                    <span className="animate-pulse">_</span>
                  </>
                ) : (
                  <span className="opacity-70">{line}</span>
                )}
              </p>
            ))}
          </div>
        ) : (
          <p
            key={factKey}
            className="inline-block w-0 overflow-hidden whitespace-nowrap text-center text-base font-black text-primary animate-[typing_2.5s_steps(45,end)_forwards]"
          >
            {factLines[0]}
          </p>
        )}
      </div>
    </div>
  );
}

export function RightPanel({
  isThinking,
  thinkingText = '',
}: {
  isThinking: boolean;
  thinkingText?: string;
}) {
  const loadingFact = useLoadingFact(isThinking);

  const isReasoning = Boolean(thinkingText && thinkingText !== 'Loading ...');
  const displayLines = isReasoning
    ? extractReadableThoughts(thinkingText)
    : [loadingFact];

  return (
    <div className="relative z-10 hidden min-h-0 flex-1 items-center justify-center overflow-hidden p-8 lg:flex">
      <div className="absolute left-10 top-16 size-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/12" />
      <div className="absolute bottom-10 right-10 size-96 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/10" />

      <div className="relative w-full">
        {!isThinking ? (
          <IdlePreview />
        ) : (
          <GeneratingPreview
            factLines={displayLines}
            factKey={isReasoning ? 'reasoning' : loadingFact}
            isReasoning={isReasoning}
          />
        )}
      </div>
    </div>
  );
}