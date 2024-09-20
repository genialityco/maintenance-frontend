import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/sliceAuth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Tipos derivados del store para usarlos en otros archivos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
