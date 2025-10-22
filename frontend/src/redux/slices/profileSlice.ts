import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ==================== INTERFACES ====================

export interface Language {
  name: string;
  level: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  technologies?: string[];
}

export interface Education {
  id: string;
  school: string;
  certificate: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  type: "certificat" | "diplôme";
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveDemo?: string;
  images?: string[];
  tags?: string[];
  date?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  icon?: string;
  level: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

// ==================== STATE ====================

interface ProfileState {
  userProfile: UserProfile;
  competences: SkillItem[];
  skills: SkillItem[];
  softSkills: SkillItem[];
  languages: Language[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  technologies: Technology[];
}

const initialState: ProfileState = {
  userProfile: {
    fullName: "",
    email: "",
    bio: "",
    location: "",
    profileImage: "",
    socialLinks: {},
  },
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
  experiences: [],
  education: [],
  certifications: [],
  projects: [],
  technologies: [],
};

// ==================== SLICE ====================

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // ------------------ User Profile ------------------
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },

    // ------------------ Experiences ------------------
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ id: string; data: Partial<Experience> }>) => {
      const index = state.experiences.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = { ...state.experiences[index], ...action.payload.data };
      }
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter((exp) => exp.id !== action.payload);
    },

    // ------------------ Education ------------------
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ id: string; data: Partial<Education> }>) => {
      const index = state.education.findIndex((edu) => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...action.payload.data };
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter((edu) => edu.id !== action.payload);
    },

    // ------------------ Certifications ------------------
    addCertification: (state, action: PayloadAction<Certification>) => {
      state.certifications.push(action.payload);
    },
    updateCertification: (state, action: PayloadAction<{ id: string; data: Partial<Certification> }>) => {
      const index = state.certifications.findIndex((cert) => cert.id === action.payload.id);
      if (index !== -1) {
        state.certifications[index] = { ...state.certifications[index], ...action.payload.data };
      }
    },
    removeCertification: (state, action: PayloadAction<string>) => {
      state.certifications = state.certifications.filter((cert) => cert.id !== action.payload);
    },

    // ------------------ Projects ------------------
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string; data: Partial<Project> }>) => {
      const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload.data };
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((proj) => proj.id !== action.payload);
    },

    // ------------------ Technologies ------------------
    addTechnology: (state, action: PayloadAction<Technology>) => {
      state.technologies.push(action.payload);
    },
    updateTechnology: (state, action: PayloadAction<{ id: string; data: Partial<Technology> }>) => {
      const index = state.technologies.findIndex((tech) => tech.id === action.payload.id);
      if (index !== -1) {
        state.technologies[index] = { ...state.technologies[index], ...action.payload.data };
      }
    },
    removeTechnology: (state, action: PayloadAction<string>) => {
      state.technologies = state.technologies.filter((tech) => tech.id !== action.payload);
    },

    // ------------------ Skills (Competences/Skills/SoftSkills) ------------------
    addItem: (
      state,
      action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; item: SkillItem }>
    ) => {
      state[action.payload.field].push(action.payload.item);
    },
    updateItem: (
      state,
      action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; index: number; item: SkillItem }>
    ) => {
      const { field, index, item } = action.payload;
      if (state[field][index]) state[field][index] = item;
    },
    removeItem: (
      state,
      action: PayloadAction<{ field: "competences" | "skills" | "softSkills"; index: number }>
    ) => {
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
  updateUserProfile,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addCertification,
  updateCertification,
  removeCertification,
  addProject,
  updateProject,
  removeProject,
  addTechnology,
  updateTechnology,
  removeTechnology,
  addItem,
  updateItem,
  removeItem,
  addLanguage,
  updateLanguage,
  removeLanguage,
} = profileSlice.actions;

export default profileSlice.reducer;
