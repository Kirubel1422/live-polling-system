import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRightPanelTab } from "@/store/editorSlice";
import { updateSlide, applyThemeToAll } from "@/store/presentationsSlice";
import { useUpdatePresentationThemeMutation } from "@/api/presentations.api";
import { useUpdateSlideSettingsMutation } from "@/api/slides.api";
import { useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Slide,
  WordCloudSlide,
  THEMES,
} from "@/types/presentation";
import { RightPanelProps, DesignTabProps, SettingsTabProps } from "./types";
import { RIGHT_PANEL_TABS } from "./data.const";



export default function RightPanel({ slide, presentationId, isTemplatePreview }: RightPanelProps) {
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

  const tabs = RIGHT_PANEL_TABS;

  return (
    <div className="flex h-full mr-2 max-w-120">
      {/* Right panel: content area (left) slides in from the right when tab is active */}
      <div className="min-w-0 flex-1 overflow-hidden w-120">
        <ScrollArea className="h-full ">
          <div
            key={activeTab}
            className="animate-in slide-in-from-right-4 fade-in-0 flex flex-col gap-4 p-4 duration-200"
          >
            {activeTab === "design" && (
              <DesignTab slide={slide} onUpdate={handleUpdateSlide} presentationId={presentationId} />
            )}
            {activeTab === "settings" && (
              <SettingsTab slide={slide} onUpdate={handleUpdateSlide} presentationId={presentationId} slideId={slide.id} isTemplatePreview={isTemplatePreview} />
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

function DesignTab({ slide, presentationId }: DesignTabProps) {
  const dispatch = useAppDispatch();
  const [updatePresentationTheme] = useUpdatePresentationThemeMutation();

  const handleThemeUpdate = async (themeUpdates: Partial<Slide["theme"]>) => {
    const newTheme = {
      ...slide.theme,
      ...themeUpdates,
    };
    dispatch(applyThemeToAll({ presentationId, theme: newTheme }));
    try {
      await updatePresentationTheme({ id: presentationId, theme: newTheme }).unwrap();
    } catch (err) {
      console.error("Failed to apply theme to all slides", err);
    }
  };

  const handleApplyPresetTheme = async (themeKey: string) => {
    const theme = THEMES[themeKey];
    if (theme) {
      dispatch(applyThemeToAll({ presentationId, theme }));
      try {
        await updatePresentationTheme({ id: presentationId, theme }).unwrap();
      } catch (err) {
        console.error("Failed to apply theme to all slides", err);
      }
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
      </div>
    </div>
  );
}

/** UUID v4 regex — slides that exist in the DB always have this format. */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isDbId = (id: string) => UUID_REGEX.test(id);

function SettingsTab({ slide, onUpdate, presentationId, slideId, isTemplatePreview }: SettingsTabProps) {
  const [updateSlideSettings] = useUpdateSlideSettingsMutation();

  // Accumulate pending updates for the debounce
  const pendingUpdatesRef = useRef<Partial<Slide["settings"]>>({});
  // Debounce ref — reuse the same timer across re-renders
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSettingsUpdate = useCallback(
    (settingsUpdates: Partial<Slide["settings"]>) => {
      // 1. Instant optimistic update in Redux
      onUpdate({
        settings: {
          ...(slide.settings || {}),
          ...settingsUpdates,
        },
      });

      // 2. Accumulate updates
      pendingUpdatesRef.current = {
        ...pendingUpdatesRef.current,
        ...settingsUpdates,
      };

      // 3. Debounced background API call (300 ms)
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const updatesToSync = pendingUpdatesRef.current;
        pendingUpdatesRef.current = {}; // reset for next batch

        // Only call the API if the slide is persisted (has a real UUID) and not in template preview
        if (!isTemplatePreview && isDbId(slideId)) {
          updateSlideSettings({
            presentationId,
            slideId,
            settings: updatesToSync as Record<string, unknown>,
          }).catch((err) => console.error("Failed to save slide settings", err));
        }
      }, 300);
    },
    [slide.settings, onUpdate, updateSlideSettings, presentationId, slideId, isTemplatePreview],
  );

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
              checked={slide.settings?.showResults ?? true}
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
            checked={slide.settings?.allowMultipleAnswers ?? false}
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
            checked={slide.settings?.showCorrectAnswer ?? true}
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
            checked={slide.settings?.isAnonymous ?? true}
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
            checked={slide.settings?.allowUpvotes ?? true}
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
            checked={slide.settings?.moderated ?? false}
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
            {slide.settings?.maxResponses || "Unlimited"}
          </span>
        </div>
        <Slider
          value={[slide.settings?.maxResponses || 0]}
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
