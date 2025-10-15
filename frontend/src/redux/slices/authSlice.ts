// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  id: string;
  full_name: string;
  email: string;
  bio?: string;
  location?: string;
  profile_image?: string;
  social_links?: {
    phone?: string;
    skills?: string;
    linkedin?: string;
    github?: string;
    availability?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AxiosErrorResponse {
  response?: { data?: { detail?: string } };
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("tb_token") || null,
  loading: false,
  error: null,
};

// ---------------- Async Thunks ----------------

// Login
export const loginUser = createAsyncThunk<
  { access_token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:8000/auth/login", credentials);
      Cookies.set("tb_token", response.data.access_token, { expires: 7 });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk<
  User,
  {
    full_name?: string;
    bio?: string;
    location?: string;
    social_links?: {
      phone?: string;
      skills?: string;
      linkedin?: string;
      github?: string;
      availability?: string;
    };
    profile_image?: string;
  },
  { state: { auth: AuthState }; rejectValue: string }
>(
  "auth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        "http://localhost:8000/users/profile",
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      return rejectWithValue(error.response?.data?.detail || "Failed to update profile");
    }
  }
);

// Update Password

export const updatePassword = createAsyncThunk<
  string,
  { current_password: string; new_password: string },
  { state: { auth: AuthState }; rejectValue: string }
>(
  "auth/updatePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        "http://localhost:8000/users/update-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message; // message de succès du backend
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      return rejectWithValue(error.response?.data?.detail || "Failed to update password");
    }
  }
);


// ---------------- Slice ----------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      Cookies.remove("tb_token");
    },
  },
  extraReducers: (builder) => {
    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
