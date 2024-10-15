import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
  role: string | null;
}

// Comprueba si hay datos en localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedRole = localStorage.getItem("role");

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser,
  token: storedToken,
  role: storedRole,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: string; token: string; role: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;

      // Guardar los datos en localStorage
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;

      // Eliminar datos de localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
