import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeAIModal,
  setAIGenerationProgress,
  setAIGenerationStatus,
} from "@/store/editorSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_THEME,
  MultipleChoiceSlide,
  OpenEndedSlide,
  QuizSlide,
  ContentSlide,
  Slide,
} from "@/types/presentation";
import { nanoid } from "nanoid";
import { Separator } from "./ui/separator";
import idle from "../../public/idle.json";
import Lottie from "lottie-react";
import { MoveUp } from "lucide-react";

interface AIGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESETS = [
  {
    id: "feedback",
    label: "Team Feedback",
    prompt: "Create a team feedback session",
  },
  { id: "quiz", label: "Fun Quiz", prompt: "Create a fun trivia quiz" },
  {
    id: "brainstorm",
    label: "Brainstorming",
    prompt: "Create a brainstorming session",
  },
  {
    id: "icebreaker",
    label: "Icebreaker",
    prompt: "Create team icebreaker questions",
  },
];

export default function AIGenerationModal({
  open,
  onOpenChange,
}: AIGenerationModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState([5]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);

  useEffect(() => {
    if (selectedPreset) {
      const preset = PRESETS.find((p) => p.id === selectedPreset);
      if (preset) {
        setPrompt(preset.prompt);
      }
    }
  }, [selectedPreset]);

  const generateMockSlides = async (): Promise<Slide[]> => {
    const slides: Slide[] = [];
    const count = slideCount[0];

    // Title slide
    slides.push({
      id: nanoid(),
      type: "content",
      title: prompt || "Interactive Presentation",
      subtitle: "Generated with AI",
      content: "Welcome to this interactive session!",
      layout: "center",
      theme: DEFAULT_THEME,
      settings: {},
      order: 0,
    } as ContentSlide);

    // Generate mix of slide types
    for (let i = 1; i < count; i++) {
      const slideTypes = ["multiple-choice", "open-ended", "quiz", "content"];
      const type = slideTypes[i % slideTypes.length];

      if (type === "multiple-choice") {
        slides.push({
          id: nanoid(),
          type: "multiple-choice",
          title: `Question ${i}: What do you think?`,
          subtitle: "Select the best option",
          options: [
            { id: nanoid(), text: "Option A", color: "#6366f1" },
            { id: nanoid(), text: "Option B", color: "#8b5cf6" },
            { id: nanoid(), text: "Option C", color: "#a855f7" },
            { id: nanoid(), text: "Option D", color: "#d946ef" },
          ],
          theme: DEFAULT_THEME,
          settings: { showResults: true },
          order: i,
        } as MultipleChoiceSlide);
      } else if (type === "open-ended") {
        slides.push({
          id: nanoid(),
          type: "open-ended",
          title: `Share your thoughts on topic ${i}`,
          subtitle: "Type your answer below",
          placeholder: "Enter your response...",
          theme: DEFAULT_THEME,
          settings: { isAnonymous: true },
          order: i,
        } as OpenEndedSlide);
      } else if (type === "quiz") {
        slides.push({
          id: nanoid(),
          type: "quiz",
          title: `Quiz: Test your knowledge!`,
          subtitle: "Select the correct answer",
          options: [
            {
              id: nanoid(),
              text: "Correct Answer",
              isCorrect: true,
              color: "#22c55e",
            },
            {
              id: nanoid(),
              text: "Wrong Answer 1",
              isCorrect: false,
              color: "#ef4444",
            },
            {
              id: nanoid(),
              text: "Wrong Answer 2",
              isCorrect: false,
              color: "#f97316",
            },
            {
              id: nanoid(),
              text: "Wrong Answer 3",
              isCorrect: false,
              color: "#eab308",
            },
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
          type: "content",
          title: `Key Point ${i}`,
          subtitle: "",
          content: "This is important information to share with your audience.",
          layout: "center",
          theme: DEFAULT_THEME,
          settings: {},
          order: i,
        } as ContentSlide);
      }
    }

    return slides;
  };

  const handleGenerate = async () => {
    dispatch(setAIGenerationStatus("generating"));
    dispatch(setAIGenerationProgress(0));

    // Simulate AI generation with progress
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      dispatch(setAIGenerationProgress((i / totalSteps) * 100));
    }

    const slides = await generateMockSlides();
    setGeneratedSlides(slides);
    dispatch(setAIGenerationStatus("complete"));
  };

  const handleClose = () => {
    onOpenChange(false);
    dispatch(closeAIModal());
    setPrompt("");
    setSelectedPreset(null);
    setGeneratedSlides([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90%] rounded-2xl p-7 h-[90%] flex">
        {/* LEFT  */}
        <div className="w-1/4 flex flex-col">
          <div className="mt-auto">
            <div className="space-y-6">
              {/* Custom Prompt */}
              <div className="space-y-2 relative">
                <Label htmlFor="prompt" className="text-xs text-neutral-600">
                  Describe your presentation
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Create a quiz about world geography with multiple choice questions..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-40 ring-offset-0 rounded-3xl resize-none shadow-none p-4 placeholder:text-xs"
                />

                <Button
                  className="absolute bottom-2 right-2"
                  onClick={handleGenerate}
                  size={"icon-sm"}
                  disabled={!prompt.trim()}
                >
                  <MoveUp />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" className="bg-gray-200" />
        {/* RIGHT  */}
        <div className="flex-1 flex items-center justify-center">
          <div>
            <Lottie
              animationData={idle}
              loop={true}
              autoplay={true}
              style={{ width: 200, height: 200 }}
            />
            <p className="text-xs text-gray-500 text-center">
              Your preview will appear here
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
