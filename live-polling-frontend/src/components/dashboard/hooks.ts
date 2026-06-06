import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPresentation } from "@/store/presentationsSlice";
import { openAIModal } from "@/store/editorSlice";
import { DEFAULT_THEME } from "@/types/presentation";
import { store } from "@/store";

export function useDashboardState() {
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
      joinCode: template.joinCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    dispatch(addPresentation(newPresentation as any));
    navigate(`/editor/${ephemeralId}`);
  };

  const handleOpenPresentation = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleOpenAIModal = () => {
    dispatch(openAIModal());
  };

  return {
    dispatch,
    isAIModalOpen,
    searchQuery,
    setSearchQuery,
    handleCreateNew,
    handleCreateFromTemplate,
    handleOpenPresentation,
    handleOpenAIModal,
  };
}
