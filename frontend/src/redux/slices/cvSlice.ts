import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/services/api";

interface CV { cv_id: string; filename: string; raw_text?: string; }
interface Job { job_id: string; title?: string; filename?: string; job_text?: string; }
interface GeneratedCV { generated_id: string; snippet?: string; }
interface Analysis { similarity?: number; match_level?: string; cv_keywords?: string[]; job_keywords?: string[]; common_keywords?: string[]; }

interface CVState {
  cv?: CV | null;
  job?: Job | null;
  generated?: GeneratedCV | null;
  analysis?: Analysis | null;
  loading: boolean;
  step: number;
}

const initialState: CVState = { cv: null, job: null, generated: null, analysis: null, loading: false, step: 1 };

export const uploadCvThunk = createAsyncThunk<CV, File>("cv/upload", async (file) => await api.uploadCV(file));
export const uploadJobThunk = createAsyncThunk<Job, { title?: string; file?: File; text?: string }>("job/upload", async (params) => await api.uploadJob(params));
export const generateCvThunk = createAsyncThunk<GeneratedCV, { cvId: string; jobId: string }>("cv/generate", async ({ cvId, jobId }) => await api.generateCV(cvId, jobId));
export const getSimilarityThunk = createAsyncThunk<{ similarity_score: number }, { cvId: string; jobId: string }>("cv/getSimilarity", async ({ cvId, jobId }) => await api.getSimilarityScore(cvId, jobId));
export const getAnalysisThunk = createAsyncThunk<Analysis, { cvId: string; jobId: string }>("cv/getAnalysis", async ({ cvId, jobId }) => await api.getAnalysis(cvId, jobId));

export const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    resetState: (state) => {
      state.cv = null; state.job = null; state.generated = null; state.analysis = null; state.loading = false; state.step = 1;
    },
    setStep: (state, action: PayloadAction<number>) => { state.step = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCvThunk.fulfilled, (state, action: PayloadAction<CV>) => { state.cv = action.payload; })
      .addCase(uploadJobThunk.fulfilled, (state, action: PayloadAction<Job>) => { state.job = action.payload; })
      .addCase(generateCvThunk.pending, (state) => { state.loading = true; })
      .addCase(generateCvThunk.fulfilled, (state, action: PayloadAction<GeneratedCV>) => { state.generated = action.payload; state.loading = false; })
      .addCase(generateCvThunk.rejected, (state) => { state.loading = false; })
      .addCase(getAnalysisThunk.fulfilled, (state, action: PayloadAction<Analysis>) => { state.analysis = action.payload; })
      .addCase(getSimilarityThunk.fulfilled, (state, action) => {
        // optional: store as analysis.similarity
        state.analysis = state.analysis ?? {};
        state.analysis.similarity = Math.round((action.payload.similarity_score ?? 0) * 100);
      });
  }
});

export const { resetState, setStep } = cvSlice.actions;
export default cvSlice.reducer;
