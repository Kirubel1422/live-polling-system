import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Slide, type SlideType, DEFAULT_THEME, type Presentation, type ContentSlide } from '@/types/presentation';
import { toast } from 'sonner';
import { useCreatePresentationMutation, useUpdatePresentationMutation, useLazyGetPresentationQuery } from '@/api/presentations.api';
import { useEnhancePresentationMutation } from '@/api/ai.api';
import { deletePresentation, addPresentation, updatePresentation, addSlide } from '@/store/presentationsSlice';
import { setSelectedSlide } from '@/store/editorSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// From AddSlideMenu.tsx
export function createSlideByType(type: SlideType): Slide {
  const baseSlide = { id: nanoid(), theme: DEFAULT_THEME, settings: {}, order: 0 };

  switch (type) {
    case 'multiple-choice':
      return {
        ...baseSlide,
        type: 'multiple-choice',
        title: 'Your question here',
        subtitle: 'Select the best option',
        options: [
          { id: nanoid(), text: 'Option A', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Option C', color: '#a855f7' },
          { id: nanoid(), text: 'Option D', color: '#d946ef' },
        ],
        settings: { showResults: true },
      };
    case 'open-ended':
      return {
        ...baseSlide,
        type: 'open-ended',
        title: 'What do you think?',
        subtitle: 'Share your thoughts',
        placeholder: 'Type your answer here...',
        settings: { isAnonymous: true },
      };
    case 'quiz':
      return {
        ...baseSlide,
        type: 'quiz',
        title: 'Quiz Question',
        subtitle: 'Select the correct answer',
        options: [
          { id: nanoid(), text: 'Correct Answer', isCorrect: true, color: '#22c55e' },
          { id: nanoid(), text: 'Wrong Answer 1', isCorrect: false, color: '#ef4444' },
          { id: nanoid(), text: 'Wrong Answer 2', isCorrect: false, color: '#f97316' },
          { id: nanoid(), text: 'Wrong Answer 3', isCorrect: false, color: '#eab308' },
        ],
        timeLimit: 30,
        points: 100,
        settings: { showCorrectAnswer: true },
      };
    case 'word-cloud':
      return { ...baseSlide, type: 'word-cloud', title: 'What comes to mind?', subtitle: 'Enter up to 3 words', maxWords: 3, profanityFilter: true };
    case 'rating':
      return { ...baseSlide, type: 'rating', title: 'How would you rate this?', subtitle: 'Select your rating', ratingType: 'stars', minValue: 1, maxValue: 5, minLabel: 'Poor', maxLabel: 'Excellent' };
    case 'ranking':
      return {
        ...baseSlide,
        type: 'ranking',
        title: 'Rank these items',
        subtitle: 'Drag to reorder',
        items: [
          { id: nanoid(), text: 'First item', color: '#6366f1' },
          { id: nanoid(), text: 'Second item', color: '#8b5cf6' },
          { id: nanoid(), text: 'Third item', color: '#a855f7' },
          { id: nanoid(), text: 'Fourth item', color: '#d946ef' },
        ],
      };
    case 'scales':
      return { ...baseSlide, type: 'scales', title: 'How do you feel about this statement?', statement: 'I am satisfied with the current process', scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }, steps: 5 };
    case 'pin-on-image':
      return { ...baseSlide, type: 'pin-on-image', title: 'Where would you place your pin?', question: 'Click on the image to place your answer', imageUrl: '' };
    case 'qa':
      return { ...baseSlide, type: 'qa', title: 'Q&A Session', subtitle: 'Submit your questions', allowSubmissions: true, questions: [], settings: { isAnonymous: false, allowUpvotes: true } };
    case 'image-choice':
      return {
        ...baseSlide,
        type: 'image-choice',
        title: 'Which do you prefer?',
        subtitle: 'Select an image',
        options: [
          { id: nanoid(), text: 'Option A', imageUrl: '', color: '#6366f1' },
          { id: nanoid(), text: 'Option B', imageUrl: '', color: '#8b5cf6' },
        ],
        settings: { showResults: true },
      };
    case 'number':
      return { ...baseSlide, type: 'number', title: 'Enter a number', subtitle: 'What is your guess?', minValue: 0, maxValue: 100, unit: '' };
    case '100-points':
      return {
        ...baseSlide,
        type: '100-points',
        title: 'Distribute 100 points',
        subtitle: 'Allocate points based on importance',
        items: [
          { id: nanoid(), text: 'Item A', color: '#6366f1' },
          { id: nanoid(), text: 'Item B', color: '#8b5cf6' },
          { id: nanoid(), text: 'Item C', color: '#a855f7' },
        ],
        totalPoints: 100,
      };
    case 'wheel-of-names':
      return { ...baseSlide, type: 'wheel-of-names', title: 'Wheel of Names', subtitle: 'Spin to pick a winner!', names: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'] };
    case 'content':
    default:
      return { ...baseSlide, type: 'content', title: 'Slide Title', subtitle: 'Optional subtitle', content: 'Add your content here', layout: 'center' };
  }
}

export function useEditorHandlers(presentation: Presentation | undefined, isTemplatePreview: boolean, setIsEnhancing: (v: boolean) => void, setEnhanceReasoning: (v: string) => void, setShowExitWarning: (v: boolean) => void) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createPresentation, { isLoading: isSaving }] = useCreatePresentationMutation();
  const [updatePresentationApi, { isLoading: isUpdating }] = useUpdatePresentationMutation();
  const [enhancePresentation] = useEnhancePresentationMutation();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (presentation) {
      dispatch(updatePresentation({ id: presentation.id, updates: { title: e.target.value } }));
    }
  };

  const handleBackClick = () => {
    if (isTemplatePreview) {
      setShowExitWarning(true);
    } else {
      navigate('/');
    }
  };

  const handleSaveClick = async () => {
    if (!presentation) return;
    if (isTemplatePreview) {
      try {
        const { id, isTemplatePreview: _, ...presentationData } = presentation as any;
        const newPresentation = await createPresentation(presentationData).unwrap();
        dispatch(deletePresentation(presentation.id));
        dispatch(addPresentation(newPresentation));
        toast.success("Template saved as your presentation!");
        navigate(`/editor/${newPresentation.id}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to save presentation");
      }
    } else {
      try {
        const { id, ...presentationData } = presentation;
        await updatePresentationApi({ id, data: presentationData }).unwrap();
        toast.success("Saved successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to save presentation");
      }
    }
  };

  const handleExitWithoutSaving = () => {
    if (presentation) dispatch(deletePresentation(presentation.id));
    setShowExitWarning(false);
    navigate('/');
  };

  const handleSaveAndExit = async () => {
    await handleSaveClick();
    navigate('/');
  };

  const handleEnhance = async (prompt: string) => {
    if (!presentation) return;
    setIsEnhancing(true);
    setEnhanceReasoning("");

    try {
      const newPresentation = await enhancePresentation({
        presentationId: presentation.id,
        prompt,
        presentationData: presentation,
        onReasoningChunk: (chunk: string) => {
          setEnhanceReasoning(chunk.length > 150 ? "..." + chunk.slice(-150) : chunk);
        }
      }).unwrap();

      if (newPresentation) {
        dispatch(updatePresentation({ id: presentation.id, updates: newPresentation }));
        toast.success("Presentation modified successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to modify presentation");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAddFirstSlide = () => {
    if (!presentation) return;
    const newSlide: ContentSlide = {
      id: crypto.randomUUID(),
      type: 'content',
      title: 'Welcome',
      subtitle: 'Click to edit',
      content: 'Start adding content to your presentation',
      layout: 'center',
      theme: presentation.theme || DEFAULT_THEME,
      settings: {},
      order: 0,
    };
    dispatch(addSlide({ presentationId: presentation.id, slide: newSlide }));
    dispatch(setSelectedSlide(newSlide.id));
  };

  return {
    isSaving: isSaving || isUpdating,
    handleTitleChange,
    handleBackClick,
    handleSaveClick,
    handleExitWithoutSaving,
    handleSaveAndExit,
    handleEnhance,
    handleAddFirstSlide
  };
}

export function useEditorState() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getPresentationById] = useLazyGetPresentationQuery();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceReasoning, setEnhanceReasoning] = useState("");

  const presentation = useAppSelector((state) =>
    state.presentations.items.find((p) => p.id === presentationId),
  );
  const selectedSlideId = useAppSelector((state) => state.editor.selectedSlideId);
  const isAIModalOpen = useAppSelector((state) => state.editor.isAIModalOpen);

  const selectedSlide = presentation?.slides.find((s) => s.id === selectedSlideId);

  useEffect(() => {
    if (presentation && presentation.slides.length > 0 && !selectedSlideId) {
      dispatch(setSelectedSlide(presentation.slides[0].id));
    }
  }, [presentation, selectedSlideId, dispatch]);

  useEffect(() => {
    if (!presentation && presentationId) {
      // If it's a template preview, it should have been put into Redux by Dashboard.
      if (presentationId.startsWith('template-')) {
        navigate('/');
        return;
      }
      
      // Fetch from API if missing from Redux
      setIsFetching(true);
      getPresentationById(presentationId)
        .unwrap()
        .then((data) => {
          dispatch(addPresentation(data));
        })
        .catch(() => {
          toast.error("Presentation not found");
          navigate('/');
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [presentation, presentationId, getPresentationById, dispatch, navigate]);

  const isTemplatePreview = presentationId?.startsWith('template-') || false;

  const handlers = useEditorHandlers(
    presentation,
    isTemplatePreview,
    setIsEnhancing,
    setEnhanceReasoning,
    setShowExitWarning
  );

  return {
    presentationId,
    navigate,
    dispatch,
    showExitWarning,
    setShowExitWarning,
    isFetching,
    isEnhancing,
    enhanceReasoning,
    presentation,
    selectedSlideId,
    isAIModalOpen,
    selectedSlide,
    isTemplatePreview,
    ...handlers
  };
}
