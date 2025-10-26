import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cvProfileReducer from "./slices/cvProfileSlice";
import jobApplicationReducer from "./slices/jobApplicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cvProfile: cvProfileReducer,
    jobApplication: jobApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
