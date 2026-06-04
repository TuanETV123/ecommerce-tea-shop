import { createSlice } from "@reduxjs/toolkit";
import { clearStoredTokens, setStoredTokens } from "../../services/authApi";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.loading = false;
      state.error = null;
      setStoredTokens(accessToken, refreshToken);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearStoredTokens();
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearStoredTokens();
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setAuthLoading,
  clearAuthError,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
