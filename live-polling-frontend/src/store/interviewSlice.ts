import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface InterviewMessage {
  role: 'user' | 'assistant'
  content: string
}

export type InterviewPhase = 'interviewing' | 'generating'

interface InterviewState {
  history: InterviewMessage[]
  phase: InterviewPhase
  enrichedPrompt: string | null
}

const initialState: InterviewState = {
  history: [],
  phase: 'interviewing',
  enrichedPrompt: null,
}

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    appendMessage: (state, action: PayloadAction<InterviewMessage>) => {
      state.history.push(action.payload)
    },
    setPhase: (state, action: PayloadAction<InterviewPhase>) => {
      state.phase = action.payload
    },
    setEnrichedPrompt: (state, action: PayloadAction<string>) => {
      state.enrichedPrompt = action.payload
    },
    clearInterview: () => initialState,
  },
})

export const {
  appendMessage,
  setPhase,
  setEnrichedPrompt,
  clearInterview,
} = interviewSlice.actions

export default interviewSlice.reducer
