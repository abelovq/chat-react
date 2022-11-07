import { configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth';
import { messagesApi } from './services/messages';
import { usersApi } from './services/users';
import authReducer from './slices/auth.slice';
import firstRenderReducer from './slices/features/firstRender.slice';
import hasMessageSentReducer from './slices/features/hasMessageSent.slice';
import selectedIdReducer from './slices/features/selectedId.slice';
import whoIsTypingReducer from './slices/features/whoIsTyping.slice';

import messagesReducer from './slices/messages.slice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    firstRender: firstRenderReducer,
    hasMessageSent: hasMessageSentReducer,
    selectedId: selectedIdReducer,
    whoIsTyping: whoIsTypingReducer,
    auth: authReducer,
    messages: messagesReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      messagesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
