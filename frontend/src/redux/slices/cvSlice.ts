// redux/slices/cvSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/services/api";  // Ensure this exists and exports uploadCV, uploadJob, generateCV

// Define types (unchanged, but ensure they match backend responses)
interface CV {
  cv_id: string;
  filename: string;
  raw_text?: string;  // Optional, if backend provides it
}

interface Job {
  job_id: string;
  title?: string;
  filename?: string;
  job_text: string;
}

interface GeneratedCV {
  generated_id: string;
  generated_text?: string;
  generated_snippet?: string;
}

interface CVState {
  cv?: CV;
  job?: Job;
  generated?: GeneratedCV;
  loading: boolean;
  step: number;  // Add for step management
}

const initialState: CVState = {
  cv: undefined,  // Fix: Was invalid syntax
  job: undefined,
  generated: undefined,
  loading: false,
  step: 1,  // Start at step 1
};

// Async Thunks (ensure api functions call your FastAPI endpoints)
export const uploadCvThunk = createAsyncThunk<CV, File>(
  "cv/upload",
  async (file: File) => {
    return await api.uploadCV(file);  // Should return { cv_id, filename, ... }
  }
);

export const uploadJobThunk = createAsyncThunk<Job, { title?: string; file?: File; text?: string }>(
  "job/upload",
  async (params) => {
    return await api.uploadJob(params);  // Should return { job_id, title, job_text, ... }
  }
);

export const generateCvThunk = createAsyncThunk<GeneratedCV, { cvId: string; jobId: string }>(
  "cv/generate",
  async ({ cvId, jobId }) => {
    return await api.generateCV(cvId, jobId);  // Should return { generated_id, ... }
  }
);

export const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    resetState: (state) => {
      state.cv = undefined;
      state.job = undefined;
      state.generated = undefined;
      state.loading = false;
      state.step = 1;
    },
    setStep: (state, action: PayloadAction<number>) => {  // Add reducer for step changes
      state.step = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCvThunk.fulfilled, (state, action: PayloadAction<CV>) => {
        state.cv = action.payload;
      })
      .addCase(uploadJobThunk.fulfilled, (state, action: PayloadAction<Job>) => {
        state.job = action.payload;
      })
      .addCase(generateCvThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateCvThunk.fulfilled, (state, action: PayloadAction<GeneratedCV>) => {
        state.generated = action.payload;
        state.loading = false;
      })
      .addCase(generateCvThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetState, setStep } = cvSlice.actions;
export default cvSlice.reducer;