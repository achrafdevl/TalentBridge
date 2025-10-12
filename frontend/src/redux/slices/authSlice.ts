import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface User {
  id?: string;
  full_name?: string;
  email?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: User;
  data?: {
    access_token?: string;
    user?: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const safeGetLocal = (k: string) =>
  typeof window !== "undefined" ? localStorage.getItem(k) : null;

const initialState: AuthState = {
  user: safeGetLocal("tb_user")
    ? JSON.parse(safeGetLocal("tb_user") as string)
    : null,
  token: safeGetLocal("tb_token"),
  loading: false,
  error: null,
};

const API_URL = "http://localhost:8000/auth";

// ----- Thunks -----

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data as AuthResponse;
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;
    return rejectWithValue(err.response?.data?.detail || "Login failed");
  }
});

export const signupUser = createAsyncThunk<
  AuthResponse,
  { full_name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signupUser", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data as AuthResponse;
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;
    return rejectWithValue(err.response?.data?.detail || "Signup failed");
  }
});

// ----- Slice -----

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        document.cookie =
          "tb_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
    setTokenAndUser: (
      state,
      action: PayloadAction<{ token?: string; user?: User }>
    ) => {
      state.token = action.payload.token ?? null;
      state.user = action.payload.user ?? null;
      if (typeof window !== "undefined") {
        if (state.token) {
          localStorage.setItem("tb_token", state.token);
          document.cookie = `tb_token=${state.token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }`;
        }
        if (state.user)
          localStorage.setItem("tb_user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          const token =
            action.payload?.access_token ??
            action.payload?.token ??
            action.payload?.data?.access_token ??
            null;
          const user =
            action.payload?.user ?? action.payload?.data?.user ?? null;
          state.token = token;
          state.user = user;
          if (typeof window !== "undefined") {
            if (token) localStorage.setItem("tb_token", token);
            if (user) localStorage.setItem("tb_user", JSON.stringify(user));
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          const token =
            action.payload?.access_token ??
            action.payload?.token ??
            action.payload?.data?.access_token ??
            null;
          const user =
            action.payload?.user ?? action.payload?.data?.user ?? null;
          state.token = token;
          state.user = user;
          if (typeof window !== "undefined") {
            if (token) localStorage.setItem("tb_token", token);
            if (user) localStorage.setItem("tb_user", JSON.stringify(user));
          }
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      });
  },
});

export const { logout, setTokenAndUser } = authSlice.actions;
export default authSlice.reducer;
