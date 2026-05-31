import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface EditorState {
  selectedSlideId: string | null
  rightPanelTab: 'design' | 'settings'
  isAIModalOpen: boolean
  aiGenerationProgress: number
  aiGenerationStatus: 'idle' | 'generating' | 'complete' | 'error'
  previewMode: 'desktop' | 'mobile'
  zoom: number
}

const initialState: EditorState = {
  selectedSlideId: null,
  rightPanelTab: 'design',
  isAIModalOpen: false,
  aiGenerationProgress: 0,
  aiGenerationStatus: 'idle',
  previewMode: 'desktop',
  zoom: 100,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSelectedSlide: (state, action: PayloadAction<string | null>) => {
      state.selectedSlideId = action.payload
    },
    setRightPanelTab: (
      state,
      action: PayloadAction<'design' | 'settings'>
    ) => {
      state.rightPanelTab = action.payload
    },
    openAIModal: (state) => {
      state.isAIModalOpen = true
    },
    closeAIModal: (state) => {
      state.isAIModalOpen = false
      state.aiGenerationProgress = 0
      state.aiGenerationStatus = 'idle'
    },
    setAIGenerationProgress: (state, action: PayloadAction<number>) => {
      state.aiGenerationProgress = action.payload
    },
    setAIGenerationStatus: (
      state,
      action: PayloadAction<'idle' | 'generating' | 'complete' | 'error'>
    ) => {
      state.aiGenerationStatus = action.payload
    },
    setPreviewMode: (state, action: PayloadAction<'desktop' | 'mobile'>) => {
      state.previewMode = action.payload
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(50, Math.min(200, action.payload))
    },
  },
})

export const {
  setSelectedSlide,
  setRightPanelTab,
  openAIModal,
  closeAIModal,
  setAIGenerationProgress,
  setAIGenerationStatus,
  setPreviewMode,
  setZoom,
} = editorSlice.actions

export default editorSlice.reducer
