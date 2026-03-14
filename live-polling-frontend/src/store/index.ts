import { configureStore } from '@reduxjs/toolkit'
import presentationsReducer from './presentationsSlice'
import editorReducer from './editorSlice'

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('presentify_state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch {
    return undefined
  }
}

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      presentations: state.presentations,
    })
    localStorage.setItem('presentify_state', serializedState)
  } catch {
    // Ignore write errors
  }
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    presentations: presentationsReducer,
    editor: editorReducer,
  },
  preloadedState,
})

// Subscribe to store changes and persist
store.subscribe(() => {
  saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
