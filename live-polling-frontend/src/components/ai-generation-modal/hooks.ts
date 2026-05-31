import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import {
  PLACEHOLDERS,
  LOADING_FACTS,
  GENERATION_STEPS,
  GENERATION_STEP_DELAY_MS,
  LOADING_FACT_INTERVAL_MS,
  PLACEHOLDER_TYPE_SPEED_MS,
  PLACEHOLDER_DELETE_SPEED_MS,
  PLACEHOLDER_PAUSE_MS,
} from './data.const';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage, AIModalActions } from './types';
import { useAppDispatch } from '@/store/hooks';
import { addPresentation } from '@/store/presentationsSlice';
import { ENV } from '@/config/env';
import {
  DEFAULT_THEME,
  type Slide,
  type ContentSlide,
  type MultipleChoiceSlide,
  type OpenEndedSlide,
  type QuizSlide,
} from '@/types/presentation';

export function useTypingPlaceholder(): string {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = PLACEHOLDERS[idx];

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
      } else {
        timeout = setTimeout(() => {
          setText(current.substring(0, text.length - 1));
        }, PLACEHOLDER_DELETE_SPEED_MS);
      }
    } else {
      if (text === current) {
        timeout = setTimeout(() => setIsDeleting(true), PLACEHOLDER_PAUSE_MS);
      } else {
        timeout = setTimeout(() => {
          setText(current.substring(0, text.length + 1));
        }, PLACEHOLDER_TYPE_SPEED_MS);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, idx, isDeleting]);

  return text;
}

export function useLoadingFact(active: boolean): string {
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (active) {
      interval = setInterval(() => {
        setFactIdx((prev) => (prev + 1) % LOADING_FACTS.length);
      }, LOADING_FACT_INTERVAL_MS);
    } else {
      setFactIdx(0);
    }

    return () => clearInterval(interval);
  }, [active]);

  return LOADING_FACTS[factIdx];
}

export async function buildMockSlides(prompt: string, count: number): Promise<Slide[]> {
  const slides: Slide[] = [];

  slides.push({
    id: nanoid(),
    type: 'content',
    title: prompt || 'Interactive Presentation',
    subtitle: 'Generated with AI',
    content: 'Welcome to this interactive session!',
    layout: 'center',
    theme: DEFAULT_THEME,
    settings: {},
    order: 0,
  } as ContentSlide);

  const slideTypes = ['multiple-choice', 'open-ended', 'quiz', 'content'];

  for (let i = 1; i < count; i++) {
    const type = slideTypes[i % slideTypes.length];

    if (type === 'multiple-choice') {
      slides.push({
        id: nanoid(),
        type: 'multiple-choice',
        title: `Question ${i}: What do you think?`,
        subtitle: 'Select the best option',
        options: [
          { id: nanoid(), text: 'Option A', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Option C', color: '#a855f7' },
          { id: nanoid(), text: 'Option D', color: '#d946ef' },
        ],
        theme: DEFAULT_THEME,
        settings: { showResults: true },
        order: i,
      } as MultipleChoiceSlide);
    } else if (type === 'open-ended') {
      slides.push({
        id: nanoid(),
        type: 'open-ended',
        title: `Share your thoughts on topic ${i}`,
        subtitle: 'Type your answer below',
        placeholder: 'Enter your response...',
        theme: DEFAULT_THEME,
        settings: { isAnonymous: true },
        order: i,
      } as OpenEndedSlide);
    } else if (type === 'quiz') {
      slides.push({
        id: nanoid(),
        type: 'quiz',
        title: 'Quiz: Test your knowledge!',
        subtitle: 'Select the correct answer',
        options: [
          { id: nanoid(), text: 'Correct Answer',  isCorrect: true,  color: '#22c55e' },
          { id: nanoid(), text: 'Wrong Answer 1',  isCorrect: false, color: '#ef4444' },
          { id: nanoid(), text: 'Wrong Answer 2',  isCorrect: false, color: '#f97316' },
          { id: nanoid(), text: 'Wrong Answer 3',  isCorrect: false, color: '#eab308' },
        ],
        timeLimit: 30,
        points: 100,
        theme: DEFAULT_THEME,
        settings: { showCorrectAnswer: true },
        order: i,
      } as QuizSlide);
    } else {
      slides.push({
        id: nanoid(),
        type: 'content',
        title: `Key Point ${i}`,
        subtitle: '',
        content: 'This is important information to share with your audience.',
        layout: 'center',
        theme: DEFAULT_THEME,
        settings: {},
        order: i,
      } as ContentSlide);
    }
  }

  return slides;
}

export async function simulateProgress(onProgress: (pct: number) => void): Promise<void> {
  for (let i = 1; i <= GENERATION_STEPS; i++) {
    await new Promise<void>((resolve) => setTimeout(resolve, GENERATION_STEP_DELAY_MS));
    onProgress((i / GENERATION_STEPS) * 100);
  }
}

export function useAIModalState(actions: AIModalActions) {
  const [prompt, setPrompt] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('Thinking ...');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const userMessage = prompt.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setPrompt('');
    setIsThinking(true);
    actions.onDispatchStatus('generating');
    actions.onDispatchProgress(0);

    // Simulate progress while waiting for the real API call
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress < 95) {
        actions.onDispatchProgress(progress);
      }
    }, 1000);

    try {
      const response = await fetch(`${ENV.API_URL}/presentations/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate presentation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentReasoning = "";
      let presentation = null;

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmed.substring(6));
                if (data.type === "reasoning") {
                  currentReasoning += data.text;
                  setThinkingText(currentReasoning);
                } else if (data.type === "presentation") {
                  presentation = data.data;
                } else if (data.type === "error") {
                  throw new Error(data.message);
                }
              } catch (e) {
                // Ignore incomplete JSON chunks
              }
            }
          }
        }
      }

      if (!presentation) {
        throw new Error('No presentation data received');
      }

      clearInterval(interval);
      actions.onDispatchProgress(100);

      const slides = presentation.slides || [];
      setGeneratedSlides(slides);
      
      // Store the generated presentation in Redux
      dispatch(addPresentation(presentation as any));

      setIsThinking(false);
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: `I've created ${slides.length} slides based on your request! I've also automatically saved this presentation for you.` },
      ]);
      actions.onDispatchStatus('complete');
      
      // Close the modal and redirect to editor
      setTimeout(() => {
        handleClose();
        navigate(`/editor/${presentation.id}`);
      }, 1500); // Give user a brief moment to see the success message
    } catch (error) {
      clearInterval(interval);
      setIsThinking(false);
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: `Sorry, there was an error generating your presentation. Please try again.` },
      ]);
      actions.onDispatchStatus('idle');
    }
  };

  const handleClose = () => {
    actions.onOpenChange(false);
    actions.onDispatchClose();
    setPrompt('');
    setGeneratedSlides([]);
    setChatMessages([]);
    setIsThinking(false);
  };

  return {
    prompt,
    setPrompt,
    generatedSlides,
    chatMessages,
    isThinking,
    thinkingText,
    handleGenerate,
    handleClose,
  };
}
