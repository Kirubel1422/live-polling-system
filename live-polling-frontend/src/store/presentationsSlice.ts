import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type Presentation, type Slide, DEFAULT_THEME } from '@/types/presentation'

interface PresentationsState {
  items: Presentation[]
  loading: boolean
}

const initialState: PresentationsState = {
  items: [],
  loading: false,
}

const presentationsSlice = createSlice({
  name: 'presentations',
  initialState,
  reducers: {
    addPresentation: (state, action: PayloadAction<Partial<Presentation>>) => {
      const newPresentation: Presentation = {
        id: action.payload.id || crypto.randomUUID(),
        title: action.payload.title || 'Untitled Presentation',
        description: action.payload.description || '',
        slides: action.payload.slides || [],
        createdAt: action.payload.createdAt || new Date().toISOString(),
        updatedAt: action.payload.updatedAt || new Date().toISOString(),
        status: action.payload.status || 'draft',
        theme: action.payload.theme || DEFAULT_THEME,
        isAIGenerated: action.payload.isAIGenerated || false,
        joinCode: action.payload.joinCode || ""
      }
      state.items.unshift(newPresentation)
    },
    updatePresentation: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Presentation> }>
    ) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deletePresentation: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    duplicatePresentation: (state, action: PayloadAction<string>) => {
      const original = state.items.find((p) => p.id === action.payload)
      if (original) {
        const duplicate: Presentation = {
          ...original,
          id: crypto.randomUUID(),
          title: `${original.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slides: original.slides.map((slide) => ({
            ...slide,
            id: crypto.randomUUID(),
          })),
        }
        state.items.unshift(duplicate)
      }
    },
    addSlide: (
      state,
      action: PayloadAction<{ presentationId: string; slide: Slide; index?: number }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        const newSlide = {
          ...action.payload.slide,
          id: crypto.randomUUID(),
          order: presentation.slides.length,
        }
        if (action.payload.index !== undefined) {
          presentation.slides.splice(action.payload.index, 0, newSlide)
          // Update order for all slides
          presentation.slides.forEach((slide, idx) => {
            slide.order = idx
          })
        } else {
          presentation.slides.push(newSlide)
        }
        presentation.updatedAt = new Date().toISOString()
      }
    },
    updateSlide: (
      state,
      action: PayloadAction<{
        presentationId: string
        slideId: string
        updates: Partial<Slide>
      }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        const slideIndex = presentation.slides.findIndex(
          (s) => s.id === action.payload.slideId
        )
        if (slideIndex !== -1) {
          presentation.slides[slideIndex] = {
            ...presentation.slides[slideIndex],
            ...action.payload.updates,
          } as Slide
          presentation.updatedAt = new Date().toISOString()
        }
      }
    },
    applyThemeToAll: (
      state,
      action: PayloadAction<{ presentationId: string; theme: any }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        presentation.theme = action.payload.theme
        presentation.slides.forEach((slide) => {
          slide.theme = action.payload.theme
        })
        presentation.updatedAt = new Date().toISOString()
      }
    },
    deleteSlide: (
      state,
      action: PayloadAction<{ presentationId: string; slideId: string }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        presentation.slides = presentation.slides.filter(
          (s) => s.id !== action.payload.slideId
        )
        // Update order for remaining slides
        presentation.slides.forEach((slide, idx) => {
          slide.order = idx
        })
        presentation.updatedAt = new Date().toISOString()
      }
    },
    reorderSlides: (
      state,
      action: PayloadAction<{ presentationId: string; slideIds: string[] }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        const reorderedSlides = action.payload.slideIds
          .map((id) => presentation.slides.find((s) => s.id === id))
          .filter((s): s is Slide => s !== undefined)
          .map((slide, idx) => ({ ...slide, order: idx }))
        presentation.slides = reorderedSlides
        presentation.updatedAt = new Date().toISOString()
      }
    },
    duplicateSlide: (
      state,
      action: PayloadAction<{ presentationId: string; slideId: string }>
    ) => {
      const presentation = state.items.find(
        (p) => p.id === action.payload.presentationId
      )
      if (presentation) {
        const slideIndex = presentation.slides.findIndex(
          (s) => s.id === action.payload.slideId
        )
        if (slideIndex !== -1) {
          const originalSlide = presentation.slides[slideIndex]
          const duplicateSlide = {
            ...originalSlide,
            id: crypto.randomUUID(),
            order: slideIndex + 1,
          }
          presentation.slides.splice(slideIndex + 1, 0, duplicateSlide)
          // Update order for all slides after the duplicate
          presentation.slides.forEach((slide, idx) => {
            slide.order = idx
          })
          presentation.updatedAt = new Date().toISOString()
        }
      }
    },
  },
})

export const {
  addPresentation,
  updatePresentation,
  deletePresentation,
  duplicatePresentation,
  addSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  duplicateSlide,
  applyThemeToAll,
} = presentationsSlice.actions

export default presentationsSlice.reducer
