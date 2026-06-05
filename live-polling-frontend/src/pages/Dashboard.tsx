import { Button } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart2,
  MousePointerClick,
  Plus,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPresentation } from "@/store/presentationsSlice";
import { openAIModal } from "@/store/editorSlice";
import { DEFAULT_THEME } from "@/types/presentation";
import { store } from "@/store";
import DashboardHeader from "@/components/dashboard/header";
import TemplatesList from "@/components/dashboard/templates";
import AIGenerationModal from "@/components/ai-generation-modal/AIGenerationModal";
import RecentPresentations from "@/components/dashboard/recent-presentation";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAIModalOpen = useAppSelector((state) => state.editor.isAIModalOpen);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCreateNew = () => {
    dispatch(
      addPresentation({
        title: "Untitled Presentation",
        theme: DEFAULT_THEME,
      }),
    );

    setTimeout(() => {
      const state = store.getState();
      const newPresentation = state.presentations.items[0];

      if (newPresentation) {
        navigate(`/editor/${newPresentation.id}`);
      }
    }, 50);
  };

  const handleCreateFromTemplate = (template: any) => {
    const ephemeralId = `template-${template.id}`;
    const newPresentation = {
      id: ephemeralId,
      title: template.title,
      description: template.description,
      slides: template.slides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      theme: DEFAULT_THEME,
      isAIGenerated: false,
    };

    dispatch(addPresentation(newPresentation as any));
    navigate(`/editor/${ephemeralId}`);
  };

  const handleOpenPresentation = (id: string) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl dark:bg-primary/8" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-secondary/16 blur-3xl dark:bg-secondary/10" />

      <div className="relative z-10">
        <DashboardHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <section className="mb-12">
            <div
              className="fade-up relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/[0.88] px-6 py-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:px-8 sm:py-10"
              style={{ animationDelay: "0.05s" }}
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

              <div className="absolute -left-24 top-16 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
              <div className="absolute -bottom-28 right-0 size-80 rounded-full bg-secondary/14 blur-3xl dark:bg-secondary/10" />

              <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                    <Sparkles className="size-4" />
                    Presentation workspace
                  </div>

                  <h1 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl">
                    Build your next{" "}
                    <span className="bg-gradient-to-r from-primary to-[#33C3FF] bg-clip-text text-transparent dark:from-white dark:to-[#33C3FF]">
                      live session.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-base leading-8 text-slate-500 dark:text-slate-400">
                    Build interactive polls, generate presentation content with
                    AI, or start from a clean blank workspace.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      onClick={() => dispatch(openAIModal())}
                      className="h-12 rounded-2xl bg-primary dark:!border-primary/20 dark:border-1  px-6 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      <Sparkles className="size-4" />
                      Generate with AI
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleCreateNew}
                      className="h-12 rounded-2xl border-2 dark:border-0 border-primary bg-white/70 px-6 font-black text-primary shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/5 dark:hover:!bg-inherit dark:bg-white/[0.04]"
                    >
                      <Plus className="size-4" />
                      Start from Scratch
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Radio className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          Live polling
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Create interactive sessions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/14 text-primary">
                        <Zap className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          AI generation
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Build content faster.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BarChart2 className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          Real-time results
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Track audience responses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <MousePointerClick className="size-4 text-primary" />
                  No friction
                </span>

                <span className="hidden size-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />

                <span>Start fast</span>

                <span className="hidden size-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />

                <span>Use templates or AI</span>
              </div>
            </div>
          </section>

          <TemplatesList handleCreateFromTemplate={handleCreateFromTemplate} />

          <RecentPresentations
            handleCreateNew={handleCreateNew}
            handleOpenPresentation={handleOpenPresentation}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      <AIGenerationModal
        open={isAIModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            dispatch({ type: "editor/closeAIModal" });
          }
        }}
      />
    </div>
  );
}