import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPresentation } from "@/store/presentationsSlice";
import { openAIModal } from "@/store/editorSlice";
import { Button } from "@/components/ui/button";
import { DEFAULT_THEME } from "@/types/presentation";
import { store } from "@/store";
import DashboardHeader from "@/components/dashboard/header";
import TemplatesList from "@/components/dashboard/templates";
import { TEMPLATES } from "@/data/mock";
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
    // Navigate after the state updates
    setTimeout(() => {
      const state = store.getState();
      const newPresentation = state.presentations.items[0];
      if (newPresentation) {
        navigate(`/editor/${newPresentation.id}`);
      }
    }, 50);
  };

  const handleCreateFromTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    dispatch(
      addPresentation({
        title: template?.title || "New Presentation",
        description: template?.description,
        theme: DEFAULT_THEME,
      }),
    );
    // Navigate after the state updates
    setTimeout(() => {
      const state = store.getState();
      const newPresentation = state.presentations.items[0];
      if (newPresentation) {
        navigate(`/editor/${newPresentation.id}`);
      }
    }, 50);
  };

  const handleOpenPresentation = (id: string) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="rounded-2xl py-10">
            <h1 className="mb-2 text-3xl font-bold text-balance">Welcome!</h1>
            <p className="mb-6 max-w-xl text-muted-foreground">
              Build interactive polls. Start from scratch or use AI to generate
              content.
            </p>
            <div className="flex gap-3">
              <Button
                variant={"default"}
                size="lg"
                onClick={() => dispatch(openAIModal())}
              >
                <Sparkles className="size-4" />
                Generate with AI
              </Button>
              <Button
                className="border-primary border-2"
                size="lg"
                variant="outline"
                onClick={handleCreateNew}
              >
                <Plus className="size-4" />
                Start from Scratch
              </Button>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <TemplatesList handleCreateFromTemplate={handleCreateFromTemplate} />

        {/* Recent Presentations */}
        <RecentPresentations
          handleCreateNew={handleCreateNew}
          handleOpenPresentation={handleOpenPresentation}
          searchQuery={searchQuery}
        />
      </main>

      {/* AI Generation Modal */}
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
