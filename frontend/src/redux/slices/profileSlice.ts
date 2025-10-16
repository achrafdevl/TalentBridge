import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Language {
  name: string;
  level: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  responsibilities: string;
}

export interface Education {
  id: string;
  school: string;
  certificate: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

interface ProfileState {
  competences: SkillItem[];
  skills: SkillItem[];
  softSkills: SkillItem[];
  languages: Language[];
  experiences: Experience[];
  education: Education[];
}

const initialState: ProfileState = {
  competences: [
    { name: "Branding", level: 2 },
    { name: "Web Development", level: 2 },
  ],
  skills: [
    { name: "UI Design", level: 1 },
    { name: "3D Design", level: 2 },
  ],
  softSkills: [
    { name: "Creativity", level: 2 },
    { name: "Adaptability", level: 1 },
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
  ],
  experiences: [
    {
      id: "1",
      company: "Eco Habitat Lux Inc.",
      position: "Creative Art Director",
      responsibilities: "Successfully increased annual revenue...",
    },
  ],
  education: [
    { id: "1", school: "University Hassan 2", certificate: "Master of Multimedia Design & Development" },
  ],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // ------------------ Experiences ------------------
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ id: string; data: Partial<Experience> }>) => {
      const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = { ...state.experiences[index], ...action.payload.data };
      }
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
    },

    // ------------------ Education ------------------
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ id: string; data: Partial<Education> }>) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...action.payload.data };
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },

    // ------------------ Competences / Skills / SoftSkills ------------------
    addItem: (state, action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; item: SkillItem }>) => {
      state[action.payload.field].push(action.payload.item);
    },
    updateItem: (state, action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; index: number; item: SkillItem }>) => {
      const { field, index, item } = action.payload;
      if (state[field][index]) state[field][index] = item;
    },
    removeItem: (state, action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; index: number }>) => {
      const { field, index } = action.payload;
      state[field].splice(index, 1);
    },

    // ------------------ Languages ------------------
    addLanguage: (state, action: PayloadAction<Language>) => {
      state.languages.push(action.payload);
    },
    updateLanguage: (state, action: PayloadAction<{ index: number; language: Language }>) => {
      const { index, language } = action.payload;
      if (state.languages[index]) state.languages[index] = language;
    },
    removeLanguage: (state, action: PayloadAction<number>) => {
      state.languages.splice(action.payload, 1);
    },
  },
});

export const {
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addItem,
  updateItem,
  removeItem,
  addLanguage,
  updateLanguage,
  removeLanguage,
} = profileSlice.actions;

export default profileSlice.reducer;
