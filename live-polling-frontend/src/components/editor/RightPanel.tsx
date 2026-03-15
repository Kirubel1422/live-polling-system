import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRightPanelTab } from "@/store/editorSlice";
import { updateSlide } from "@/store/presentationsSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FileText,
  Palette,
  Plus,
  Settings,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  Slide,
  MultipleChoiceSlide,
  QuizSlide,
  SlideOption,
  RatingSlide,
  RankingSlide,
  ScalesSlide,
  WordCloudSlide,
  NumberSlide,
  PointsSlide,
  WheelSlide,
  ImageChoiceSlide,
  QASlide,
  THEMES,
} from "@/types/presentation";
import { nanoid } from "nanoid";

interface RightPanelProps {
  slide: Slide;
  presentationId: string;
}

export default function RightPanel({ slide, presentationId }: RightPanelProps) {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.editor.rightPanelTab);

  const handleUpdateSlide = (updates: Partial<Slide>) => {
    dispatch(
      updateSlide({
        presentationId,
        slideId: slide.id,
        updates,
      }),
    );
  };

  const tabs: {
    id: "content" | "design" | "settings";
    label: string;
    icon: typeof FileText;
  }[] = [
    { id: "content", label: "Edit", icon: FileText },
    { id: "design", label: "Design", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-full mr-2 max-w-120">
      {/* Content area (left) – slides in from the right when tab is active */}
      <div className="min-w-0 flex-1 overflow-hidden w-120">
        <ScrollArea className="h-full ">
          <div
            key={activeTab}
            className="animate-in slide-in-from-right-4 fade-in-0 flex flex-col gap-4 p-4 duration-200"
          >
            {activeTab === "content" && (
              <ContentTab
                slide={slide}
                onUpdate={handleUpdateSlide}
                presentationId={presentationId}
              />
            )}
            {activeTab === "design" && (
              <DesignTab slide={slide} onUpdate={handleUpdateSlide} />
            )}
            {activeTab === "settings" && (
              <SettingsTab slide={slide} onUpdate={handleUpdateSlide} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Vertical tabs (right) */}
      <div className="flex shrink-0 flex-col mt-4 h-fit border-l border-border/60 bg-white p-1 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => dispatch(setRightPanelTab(tab.id))}
              className={cn(
                "flex flex-col items-center gap-1 px-7 py-8 text-xs font-medium transition-colors",
                isActive && "border border-primary bg-primary/10 rounded-2xl",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContentTab({
  slide,
  onUpdate,
  presentationId,
}: {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
  presentationId: string;
}) {
  const dispatch = useAppDispatch();

  const handleAddOption = () => {
    if (
      slide.type === "multiple-choice" ||
      slide.type === "quiz" ||
      slide.type === "image-choice"
    ) {
      const currentSlide = slide as
        | MultipleChoiceSlide
        | QuizSlide
        | ImageChoiceSlide;
      const colors = [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
      ];
      const newOption: SlideOption = {
        id: nanoid(),
        text: `Option ${currentSlide.options.length + 1}`,
        color: colors[currentSlide.options.length % colors.length],
        isCorrect: false,
      };
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: {
            options: [...currentSlide.options, newOption],
          },
        }),
      );
    }
  };

  const handleAddRankingItem = () => {
    if (slide.type === "ranking") {
      const currentSlide = slide as RankingSlide;
      const colors = [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
      ];
      const newItem: SlideOption = {
        id: nanoid(),
        text: `Item ${currentSlide.items.length + 1}`,
        color: colors[currentSlide.items.length % colors.length],
      };
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: {
            items: [...currentSlide.items, newItem],
          },
        }),
      );
    }
  };

  const handleAddPointsItem = () => {
    if (slide.type === "100-points") {
      const currentSlide = slide as PointsSlide;
      const colors = [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
      ];
      const newItem: SlideOption = {
        id: nanoid(),
        text: `Item ${currentSlide.items.length + 1}`,
        color: colors[currentSlide.items.length % colors.length],
      };
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: {
            items: [...currentSlide.items, newItem],
          },
        }),
      );
    }
  };

  const handleAddName = () => {
    if (slide.type === "wheel-of-names") {
      const currentSlide = slide as WheelSlide;
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: {
            names: [
              ...currentSlide.names,
              `Name ${currentSlide.names.length + 1}`,
            ],
          },
        }),
      );
    }
  };

  const handleUpdateOption = (
    optionId: string,
    updates: Partial<SlideOption>,
  ) => {
    if (
      slide.type === "multiple-choice" ||
      slide.type === "quiz" ||
      slide.type === "image-choice"
    ) {
      const currentSlide = slide as
        | MultipleChoiceSlide
        | QuizSlide
        | ImageChoiceSlide;
      const updatedOptions = currentSlide.options.map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { options: updatedOptions },
        }),
      );
    }
  };

  const handleUpdateRankingItem = (
    itemId: string,
    updates: Partial<SlideOption>,
  ) => {
    if (slide.type === "ranking") {
      const currentSlide = slide as RankingSlide;
      const updatedItems = currentSlide.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { items: updatedItems },
        }),
      );
    }
  };

  const handleUpdatePointsItem = (
    itemId: string,
    updates: Partial<SlideOption>,
  ) => {
    if (slide.type === "100-points") {
      const currentSlide = slide as PointsSlide;
      const updatedItems = currentSlide.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { items: updatedItems },
        }),
      );
    }
  };

  const handleDeleteOption = (optionId: string) => {
    if (
      slide.type === "multiple-choice" ||
      slide.type === "quiz" ||
      slide.type === "image-choice"
    ) {
      const currentSlide = slide as
        | MultipleChoiceSlide
        | QuizSlide
        | ImageChoiceSlide;
      const updatedOptions = currentSlide.options.filter(
        (opt) => opt.id !== optionId,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { options: updatedOptions },
        }),
      );
    }
  };

  const handleDeleteRankingItem = (itemId: string) => {
    if (slide.type === "ranking") {
      const currentSlide = slide as RankingSlide;
      const updatedItems = currentSlide.items.filter(
        (item) => item.id !== itemId,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { items: updatedItems },
        }),
      );
    }
  };

  const handleDeletePointsItem = (itemId: string) => {
    if (slide.type === "100-points") {
      const currentSlide = slide as PointsSlide;
      const updatedItems = currentSlide.items.filter(
        (item) => item.id !== itemId,
      );
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { items: updatedItems },
        }),
      );
    }
  };

  const handleUpdateName = (index: number, value: string) => {
    if (slide.type === "wheel-of-names") {
      const currentSlide = slide as WheelSlide;
      const updatedNames = [...currentSlide.names];
      updatedNames[index] = value;
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { names: updatedNames },
        }),
      );
    }
  };

  const handleDeleteName = (index: number) => {
    if (slide.type === "wheel-of-names") {
      const currentSlide = slide as WheelSlide;
      const updatedNames = currentSlide.names.filter((_, i) => i !== index);
      dispatch(
        updateSlide({
          presentationId,
          slideId: slide.id,
          updates: { names: updatedNames },
        }),
      );
    }
  };

  return (
    <div className="space-y-6 bg-zinc-50 p-10 rounded-2xl">
      {/* Common fields */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={slide.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter slide title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={slide.subtitle || ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Optional subtitle"
        />
      </div>

      {/* Content field for content slides */}
      {slide.type === "content" && (
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={(slide as any).content || ""}
            onChange={(e) => onUpdate({ content: e.target.value } as any)}
            placeholder="Enter slide content"
            className="min-h-32"
          />
        </div>
      )}

      {/* Options for multiple choice, quiz, and image-choice */}
      {(slide.type === "multiple-choice" ||
        slide.type === "quiz" ||
        slide.type === "image-choice") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="size-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {(
              slide as MultipleChoiceSlide | QuizSlide | ImageChoiceSlide
            ).options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                <div
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: option.color }}
                />
                <Input
                  value={option.text}
                  onChange={(e) =>
                    handleUpdateOption(option.id, { text: e.target.value })
                  }
                  className="h-8 flex-1"
                />
                {slide.type === "quiz" && (
                  <Switch
                    checked={option.isCorrect}
                    onCheckedChange={(checked) =>
                      handleUpdateOption(option.id, { isCorrect: checked })
                    }
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteOption(option.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ranking items */}
      {slide.type === "ranking" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Items to Rank</Label>
            <Button variant="outline" size="sm" onClick={handleAddRankingItem}>
              <Plus className="size-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {(slide as RankingSlide).items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                <span className="text-xs text-muted-foreground w-4">
                  {index + 1}
                </span>
                <Input
                  value={item.text}
                  onChange={(e) =>
                    handleUpdateRankingItem(item.id, { text: e.target.value })
                  }
                  className="h-8 flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteRankingItem(item.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 100-points items */}
      {slide.type === "100-points" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <Button variant="outline" size="sm" onClick={handleAddPointsItem}>
              <Plus className="size-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {(slide as PointsSlide).items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                <div
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <Input
                  value={item.text}
                  onChange={(e) =>
                    handleUpdatePointsItem(item.id, { text: e.target.value })
                  }
                  className="h-8 flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeletePointsItem(item.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Total Points</Label>
            <Input
              type="number"
              value={(slide as PointsSlide).totalPoints}
              onChange={(e) =>
                onUpdate({
                  totalPoints: parseInt(e.target.value) || 100,
                } as any)
              }
            />
          </div>
        </div>
      )}

      {/* Wheel of Names */}
      {slide.type === "wheel-of-names" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Names</Label>
            <Button variant="outline" size="sm" onClick={handleAddName}>
              <Plus className="size-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {(slide as WheelSlide).names.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                <Input
                  value={name}
                  onChange={(e) => handleUpdateName(index, e.target.value)}
                  className="h-8 flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteName(index)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz specific fields */}
      {slide.type === "quiz" && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Time Limit</Label>
                <span className="text-sm text-muted-foreground">
                  {(slide as QuizSlide).timeLimit}s
                </span>
              </div>
              <Slider
                value={[(slide as QuizSlide).timeLimit]}
                onValueChange={([value]) =>
                  onUpdate({ timeLimit: value } as any)
                }
                min={10}
                max={120}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Points</Label>
                <span className="text-sm text-muted-foreground">
                  {(slide as QuizSlide).points}
                </span>
              </div>
              <Slider
                value={[(slide as QuizSlide).points]}
                onValueChange={([value]) => onUpdate({ points: value } as any)}
                min={50}
                max={500}
                step={50}
              />
            </div>
          </div>
        </>
      )}

      {/* Open ended specific */}
      {slide.type === "open-ended" && (
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Input
            id="placeholder"
            value={(slide as any).placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value } as any)}
            placeholder="Enter your answer..."
          />
        </div>
      )}

      {/* Word cloud specific */}
      {slide.type === "word-cloud" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Max Words per Response</Label>
              <span className="text-sm text-muted-foreground">
                {(slide as WordCloudSlide).maxWords || 3}
              </span>
            </div>
            <Slider
              value={[(slide as WordCloudSlide).maxWords || 3]}
              onValueChange={([value]) => onUpdate({ maxWords: value } as any)}
              min={1}
              max={5}
              step={1}
            />
          </div>
        </div>
      )}

      {/* Rating specific */}
      {slide.type === "rating" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rating Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {["stars", "numbers", "slider", "nps", "emoji"].map((type) => (
                <Button
                  key={type}
                  variant={
                    (slide as RatingSlide).ratingType === type
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => onUpdate({ ratingType: type } as any)}
                  className="capitalize"
                >
                  {type === "nps" ? "NPS" : type}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Value</Label>
              <Input
                type="number"
                value={(slide as RatingSlide).minValue}
                onChange={(e) =>
                  onUpdate({ minValue: parseInt(e.target.value) || 0 } as any)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Value</Label>
              <Input
                type="number"
                value={(slide as RatingSlide).maxValue}
                onChange={(e) =>
                  onUpdate({ maxValue: parseInt(e.target.value) || 5 } as any)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Min Label</Label>
            <Input
              value={(slide as RatingSlide).minLabel || ""}
              onChange={(e) => onUpdate({ minLabel: e.target.value } as any)}
              placeholder="e.g., Poor"
            />
          </div>
          <div className="space-y-2">
            <Label>Max Label</Label>
            <Input
              value={(slide as RatingSlide).maxLabel || ""}
              onChange={(e) => onUpdate({ maxLabel: e.target.value } as any)}
              placeholder="e.g., Excellent"
            />
          </div>
        </div>
      )}

      {/* Scales specific */}
      {slide.type === "scales" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Statement</Label>
            <Textarea
              value={(slide as ScalesSlide).statement}
              onChange={(e) => onUpdate({ statement: e.target.value } as any)}
              placeholder="Enter the statement to rate"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Left Label</Label>
              <Input
                value={(slide as ScalesSlide).scaleLabels?.left || ""}
                onChange={(e) =>
                  onUpdate({
                    scaleLabels: {
                      ...(slide as ScalesSlide).scaleLabels,
                      left: e.target.value,
                    },
                  } as any)
                }
                placeholder="Strongly Disagree"
              />
            </div>
            <div className="space-y-2">
              <Label>Right Label</Label>
              <Input
                value={(slide as ScalesSlide).scaleLabels?.right || ""}
                onChange={(e) =>
                  onUpdate({
                    scaleLabels: {
                      ...(slide as ScalesSlide).scaleLabels,
                      right: e.target.value,
                    },
                  } as any)
                }
                placeholder="Strongly Agree"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Number of Steps</Label>
            <div className="flex gap-2">
              <Button
                variant={
                  (slide as ScalesSlide).steps === 5 ? "default" : "outline"
                }
                size="sm"
                onClick={() => onUpdate({ steps: 5 } as any)}
              >
                5 Steps
              </Button>
              <Button
                variant={
                  (slide as ScalesSlide).steps === 7 ? "default" : "outline"
                }
                size="sm"
                onClick={() => onUpdate({ steps: 7 } as any)}
              >
                7 Steps
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Number input specific */}
      {slide.type === "number" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Value</Label>
              <Input
                type="number"
                value={(slide as NumberSlide).minValue ?? ""}
                onChange={(e) =>
                  onUpdate({
                    minValue: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  } as any)
                }
                placeholder="No min"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Value</Label>
              <Input
                type="number"
                value={(slide as NumberSlide).maxValue ?? ""}
                onChange={(e) =>
                  onUpdate({
                    maxValue: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  } as any)
                }
                placeholder="No max"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={(slide as NumberSlide).unit || ""}
              onChange={(e) => onUpdate({ unit: e.target.value } as any)}
              placeholder="e.g., km, $, %"
            />
          </div>
        </div>
      )}

      {/* Pin on Image specific */}
      {slide.type === "pin-on-image" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={(slide as any).imageUrl || ""}
              onChange={(e) => onUpdate({ imageUrl: e.target.value } as any)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              value={(slide as any).question || ""}
              onChange={(e) => onUpdate({ question: e.target.value } as any)}
              placeholder="Where would you place your pin?"
            />
          </div>
        </div>
      )}

      {/* Q&A specific */}
      {slide.type === "qa" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Submissions</Label>
              <p className="text-xs text-muted-foreground">
                Let participants submit questions
              </p>
            </div>
            <Switch
              checked={(slide as QASlide).allowSubmissions ?? true}
              onCheckedChange={(checked) =>
                onUpdate({ allowSubmissions: checked } as any)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DesignTab({
  slide,
  onUpdate,
}: {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
}) {
  const handleThemeUpdate = (themeUpdates: Partial<Slide["theme"]>) => {
    onUpdate({
      theme: {
        ...slide.theme,
        ...themeUpdates,
      },
    });
  };

  const handleApplyPresetTheme = (themeKey: string) => {
    const theme = THEMES[themeKey];
    if (theme) {
      onUpdate({ theme });
    }
  };

  return (
    <div className="space-y-6 bg-zinc-50 p-10 rounded-2xl">
      <div className="space-y-3">
        <Label>Theme Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleApplyPresetTheme(key)}
              className="aspect-video rounded-lg border-2 overflow-hidden transition-all hover:border-primary flex flex-col items-center justify-center p-2"
              style={{ backgroundColor: theme.backgroundColor }}
            >
              <div
                className="h-1.5 w-8 rounded mb-1"
                style={{ backgroundColor: theme.textColor }}
              />
              <div
                className="h-1.5 w-6 rounded"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span
                className="text-[10px] mt-1 capitalize"
                style={{ color: theme.textColor }}
              >
                {key.replace("-", " ")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="bg-color"
              value={slide.theme.backgroundColor}
              onChange={(e) =>
                handleThemeUpdate({ backgroundColor: e.target.value })
              }
              className="h-9 w-12 p-1"
            />
            <Input
              value={slide.theme.backgroundColor}
              onChange={(e) =>
                handleThemeUpdate({ backgroundColor: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="text-color"
              value={slide.theme.textColor}
              onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
              className="h-9 w-12 p-1"
            />
            <Input
              value={slide.theme.textColor}
              onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="accent-color"
              value={slide.theme.accentColor}
              onChange={(e) =>
                handleThemeUpdate({ accentColor: e.target.value })
              }
              className="h-9 w-12 p-1"
            />
            <Input
              value={slide.theme.accentColor}
              onChange={(e) =>
                handleThemeUpdate({ accentColor: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  slide,
  onUpdate,
}: {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
}) {
  const handleSettingsUpdate = (
    settingsUpdates: Partial<Slide["settings"]>,
  ) => {
    onUpdate({
      settings: {
        ...slide.settings,
        ...settingsUpdates,
      },
    });
  };

  return (
    <div className="space-y-6 bg-zinc-50 p-10 rounded-2xl">
      {(slide.type === "multiple-choice" ||
        slide.type === "quiz" ||
        slide.type === "image-choice") && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Results</Label>
              <p className="text-xs text-muted-foreground">
                Display results after voting
              </p>
            </div>
            <Switch
              checked={slide.settings.showResults ?? true}
              onCheckedChange={(checked) =>
                handleSettingsUpdate({ showResults: checked })
              }
            />
          </div>
        </>
      )}

      {slide.type === "multiple-choice" && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Allow Multiple Answers</Label>
            <p className="text-xs text-muted-foreground">
              Let participants select multiple options
            </p>
          </div>
          <Switch
            checked={slide.settings.allowMultipleAnswers ?? false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate({ allowMultipleAnswers: checked })
            }
          />
        </div>
      )}

      {slide.type === "quiz" && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Show Correct Answer</Label>
            <p className="text-xs text-muted-foreground">
              Reveal correct answer after time is up
            </p>
          </div>
          <Switch
            checked={slide.settings.showCorrectAnswer ?? true}
            onCheckedChange={(checked) =>
              handleSettingsUpdate({ showCorrectAnswer: checked })
            }
          />
        </div>
      )}

      {(slide.type === "open-ended" || slide.type === "qa") && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Anonymous Responses</Label>
            <p className="text-xs text-muted-foreground">
              Hide participant names
            </p>
          </div>
          <Switch
            checked={slide.settings.isAnonymous ?? true}
            onCheckedChange={(checked) =>
              handleSettingsUpdate({ isAnonymous: checked })
            }
          />
        </div>
      )}

      {slide.type === "qa" && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Allow Upvotes</Label>
            <p className="text-xs text-muted-foreground">
              Let participants upvote questions
            </p>
          </div>
          <Switch
            checked={slide.settings.allowUpvotes ?? true}
            onCheckedChange={(checked) =>
              handleSettingsUpdate({ allowUpvotes: checked })
            }
          />
        </div>
      )}

      {slide.type === "word-cloud" && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Profanity Filter</Label>
            <p className="text-xs text-muted-foreground">
              Filter inappropriate words
            </p>
          </div>
          <Switch
            checked={(slide as WordCloudSlide).profanityFilter ?? true}
            onCheckedChange={(checked) =>
              onUpdate({ profanityFilter: checked } as any)
            }
          />
        </div>
      )}

      {slide.type === "open-ended" && (
        <div className="flex items-center justify-between">
          <div>
            <Label>Moderated</Label>
            <p className="text-xs text-muted-foreground">
              Approve responses before showing
            </p>
          </div>
          <Switch
            checked={slide.settings.moderated ?? false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate({ moderated: checked })
            }
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Max Responses</Label>
          <span className="text-sm text-muted-foreground">
            {slide.settings.maxResponses || "Unlimited"}
          </span>
        </div>
        <Slider
          value={[slide.settings.maxResponses || 0]}
          onValueChange={([value]) =>
            handleSettingsUpdate({ maxResponses: value || undefined })
          }
          min={0}
          max={100}
          step={5}
        />
        <p className="text-xs text-muted-foreground">0 = unlimited responses</p>
      </div>
    </div>
  );
}
