import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/sliceAuth";
import organizationReducer from "../features/organization/sliceOrganization";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
  },
});

// Tipos derivados del store para usarlos en otros archivos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
