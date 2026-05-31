import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import presentationsReducer, { updatePresentation } from './presentationsSlice'
import editorReducer from './editorSlice'
import presentationsApi from '@/api/presentations.api'
import authApi from '@/api/auth.api'
import templatesApi from '@/api/templates.api'
import slidesApi from '@/api/slides.api'
import userApi from '@/api/user.api'
import aiApi from '@/api/ai.api'
import participantApi from '@/api/participant.api'
import { updateSlide, addSlide } from './presentationsSlice'

const listenerMiddleware = createListenerMiddleware()

// Sync Slide Creation
listenerMiddleware.startListening({
  actionCreator: addSlide,
  effect: async (action, listenerApi) => {
    const { presentationId, slide } = action.payload;
    if (presentationId.startsWith('template-')) return;
    listenerApi.dispatch(
      slidesApi.endpoints.createSlide.initiate({ presentationId, data: slide })
    );
  }
});

// Sync Slide Updates
listenerMiddleware.startListening({
  actionCreator: updateSlide,
  effect: async (action, listenerApi) => {
    const { presentationId, slideId, updates } = action.payload;
    if (presentationId.startsWith('template-')) return;

    const coreFields = ['id', 'type', 'title', 'subtitle', 'order', 'theme', 'settings', 'options', 'createdAt', 'updatedAt', 'presentationId'];
    const dataToSend: any = {};
    const metaUpdates: any = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (coreFields.includes(key)) {
        dataToSend[key] = value;
      } else {
        metaUpdates[key] = value;
      }
    });

    if (Object.keys(metaUpdates).length > 0) {
      dataToSend.meta = metaUpdates;
    }

    listenerApi.dispatch(
      slidesApi.endpoints.updateSlide.initiate({ presentationId, slideId, data: dataToSend })
    );
  }
});

// Sync Presentation Updates (Debounced)
listenerMiddleware.startListening({
  actionCreator: updatePresentation,
  effect: async (action, listenerApi) => {
    // Cancel any previous listeners for this action
    listenerApi.cancelActiveListeners();
    // Debounce by 1 second
    await listenerApi.delay(1000);

    const { id, updates } = action.payload;
    if (id.startsWith('template-')) return;
    
    listenerApi.dispatch(
      presentationsApi.endpoints.updatePresentation.initiate({ id, data: updates })
    );
  }
});

export const store = configureStore({
  reducer: {
    presentations: presentationsReducer,
    editor: editorReducer,
    [presentationsApi.reducerPath]: presentationsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
    [slidesApi.reducerPath]: slidesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [participantApi.reducerPath]: participantApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(
      presentationsApi.middleware,
      authApi.middleware,
      templatesApi.middleware,
      slidesApi.middleware,
      userApi.middleware,
      aiApi.middleware,
      participantApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
