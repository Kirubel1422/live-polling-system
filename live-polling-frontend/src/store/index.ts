import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import presentationsReducer from './presentationsSlice'
import editorReducer from './editorSlice'
import presentationsApi from '@/api/presentations.api'
import authApi from '@/api/auth.api'
import templatesApi from '@/api/templates.api'
import slidesApi from '@/api/slides.api'

export const store = configureStore({
  reducer: {
    presentations: presentationsReducer,
    editor: editorReducer,
    [presentationsApi.reducerPath]: presentationsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
    [slidesApi.reducerPath]: slidesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      presentationsApi.middleware,
      authApi.middleware,
      templatesApi.middleware,
      slidesApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
