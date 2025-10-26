import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// ==================== INTERFACES ====================

export interface UserProfile {
  id?: string;
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

export interface Language {
  id?: string;
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

export interface Competence {
  id?: string;
  name: string;
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
  level?: string;
}

// ==================== STATE ====================

interface CvProfileState {
  userProfile: UserProfile | null;
  certifications: Certification[];
  competences: Competence[];
  education: Education[];
  experiences: Experience[];
  languages: Language[];
  projects: Project[];
  technologies: Technology[];
  loading: boolean;
  error: string | null;
}

const initialState: CvProfileState = {
  userProfile: null,
  certifications: [],
  competences: [],
  education: [],
  experiences: [],
  languages: [],
  projects: [],
  technologies: [],
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

const API_BASE_URL = "http://localhost:8000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("tb_token")}`,
});

const handleError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || defaultMessage;
  }
  return defaultMessage;
};

//! CV Profile
export const fetchUserProfile = createAsyncThunk(
  "cvProfile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cv-profile/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      // Don't treat 404 as an error (profile not found is a valid state)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw error; // Re-throw so it's caught by the reducer without setting error state
      }
      return rejectWithValue(
        handleError(error, "Failed to fetch user profile")
      );
    }
  }
);

export const createUserProfile = createAsyncThunk(
  "cvProfile/createUserProfile",
  async (profile: Omit<UserProfile, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cv-profile/`,
        profile,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage = handleError(error, "Failed to create user profile");
      // Log the full error for debugging
      if (axios.isAxiosError(error)) {
        console.error("Create profile error:", error.response?.data);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "cvProfile/updateUserProfile",
  async (profile: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/cv-profile/`, profile, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to update user profile")
      );
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  "cvProfile/deleteUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/cv-profile/`, {
        headers: getAuthHeaders(),
      });
      return true;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to delete user profile")
      );
    }
  }
);

//! Certifications
export const fetchCertifications = createAsyncThunk(
  "cvProfile/fetchCertifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/certifications/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to fetch certifications")
      );
    }
  }
);

export const createCertification = createAsyncThunk(
  "cvProfile/createCertification",
  async (cert: Omit<Certification, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/certifications/`,
        cert,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to create certification")
      );
    }
  }
);

export const updateCertification = createAsyncThunk(
  "cvProfile/updateCertification",
  async (
    { id, data }: { id: string; data: Partial<Certification> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/certifications/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to update certification")
      );
    }
  }
);

export const deleteCertification = createAsyncThunk(
  "cvProfile/deleteCertification",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/certifications/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to delete certification")
      );
    }
  }
);

//! Competences
export const fetchCompetences = createAsyncThunk(
  "cvProfile/fetchCompetences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/competences/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to fetch competences"));
    }
  }
);

export const createCompetence = createAsyncThunk(
  "cvProfile/createCompetence",
  async (comp: Competence, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/competences/`, comp, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create competence"));
    }
  }
);

export const updateCompetence = createAsyncThunk(
  "cvProfile/updateCompetence",
  async (
    { id, data }: { id: string; data: Partial<Competence> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/competences/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update competence"));
    }
  }
);

export const deleteCompetence = createAsyncThunk(
  "cvProfile/deleteCompetence",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/competences/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete competence"));
    }
  }
);

//! Education
export const fetchEducation = createAsyncThunk(
  "cvProfile/fetchEducation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/education/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to fetch education"));
    }
  }
);

export const createEducation = createAsyncThunk(
  "cvProfile/createEducation",
  async (edu: Omit<Education, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/education/`, edu, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create education"));
    }
  }
);

export const updateEducation = createAsyncThunk(
  "cvProfile/updateEducation",
  async (
    { id, data }: { id: string; data: Partial<Education> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/education/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update education"));
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "cvProfile/deleteEducation",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/education/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete education"));
    }
  }
);

//! Experiences
export const fetchExperiences = createAsyncThunk(
  "cvProfile/fetchExperiences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/experiences/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to fetch experiences"));
    }
  }
);

export const createExperience = createAsyncThunk(
  "cvProfile/createExperience",
  async (exp: Omit<Experience, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/experiences/`, exp, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create experience"));
    }
  }
);

export const updateExperience = createAsyncThunk(
  "cvProfile/updateExperience",
  async (
    { id, data }: { id: string; data: Partial<Experience> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/experiences/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update experience"));
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "cvProfile/deleteExperience",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/experiences/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete experience"));
    }
  }
);

//! Languages
export const fetchLanguages = createAsyncThunk(
  "cvProfile/fetchLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/languages/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to fetch languages"));
    }
  }
);

export const createLanguage = createAsyncThunk(
  "cvProfile/createLanguage",
  async (lang: Language, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/languages/`, lang, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create language"));
    }
  }
);

export const updateLanguage = createAsyncThunk(
  "cvProfile/updateLanguage",
  async (
    { id, data }: { id: string; data: Partial<Language> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/languages/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update language"));
    }
  }
);

export const deleteLanguage = createAsyncThunk(
  "cvProfile/deleteLanguage",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/languages/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete language"));
    }
  }
);

//! Projects
export const fetchProjects = createAsyncThunk(
  "cvProfile/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to fetch projects"));
    }
  }
);

export const createProject = createAsyncThunk(
  "cvProfile/createProject",
  async (project: Omit<Project, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects/`, project, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create project"));
    }
  }
);

export const updateProject = createAsyncThunk(
  "cvProfile/updateProject",
  async (
    { id, data }: { id: string; data: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/projects/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update project"));
    }
  }
);

export const deleteProject = createAsyncThunk(
  "cvProfile/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete project"));
    }
  }
);

//! Technologies
export const fetchTechnologies = createAsyncThunk(
  "cvProfile/fetchTechnologies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/technologies/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        handleError(error, "Failed to fetch technologies")
      );
    }
  }
);

export const createTechnology = createAsyncThunk(
  "cvProfile/createTechnology",
  async (tech: Omit<Technology, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/technologies/`, tech, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to create technology"));
    }
  }
);

export const updateTechnology = createAsyncThunk(
  "cvProfile/updateTechnology",
  async (
    { id, data }: { id: string; data: Partial<Technology> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/technologies/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to update technology"));
    }
  }
);

export const deleteTechnology = createAsyncThunk(
  "cvProfile/deleteTechnology",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/technologies/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error, "Failed to delete technology"));
    }
  }
);

// ==================== SLICE ====================

export const cvProfileSlice = createSlice({
  name: "cvProfile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        // Only set error if it's not a 404 (profile not found)
        const error = action.payload as string | undefined;
        if (error && !error.includes("not found") && !error.includes("404")) {
          state.error = error;
        }
        // Don't set userProfile to null if it's just a 404 (not found)
        // Allow the previous state to persist
      })
      .addCase(createUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create profile";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update profile";
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.userProfile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete profile";
      });

    // Certifications
    builder
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.certifications = action.payload;
      })
      .addCase(createCertification.fulfilled, (state, action) => {
        state.certifications.push(action.payload);
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        const index = state.certifications.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.certifications[index] = action.payload;
        }
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.certifications = state.certifications.filter(
          (c) => c.id !== action.payload
        );
      });

    // Competences
    builder
      .addCase(fetchCompetences.fulfilled, (state, action) => {
        state.competences = action.payload;
      })
      .addCase(createCompetence.fulfilled, (state, action) => {
        state.competences.push(action.payload);
      })
      .addCase(updateCompetence.fulfilled, (state, action) => {
        const index = state.competences.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competences[index] = action.payload;
        }
      })
      .addCase(deleteCompetence.fulfilled, (state, action) => {
        state.competences = state.competences.filter(
          (c) => c.id !== action.payload
        );
      });

    // Education
    builder
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.education = action.payload;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.education.push(action.payload);
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const index = state.education.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.education[index] = action.payload;
        }
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.education = state.education.filter(
          (e) => e.id !== action.payload
        );
      });

    // Experiences
    builder
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.experiences = action.payload;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.experiences.push(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.experiences.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(
          (e) => e.id !== action.payload
        );
      });

    // Languages
    builder
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
      })
      .addCase(createLanguage.fulfilled, (state, action) => {
        state.languages.push(action.payload);
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        const index = state.languages.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.languages[index] = action.payload;
        }
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.languages = state.languages.filter(
          (l) => l.id !== action.payload
        );
      });

    // Projects
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      });

    // Technologies
    builder
      .addCase(fetchTechnologies.fulfilled, (state, action) => {
        state.technologies = action.payload;
      })
      .addCase(createTechnology.fulfilled, (state, action) => {
        state.technologies.push(action.payload);
      })
      .addCase(updateTechnology.fulfilled, (state, action) => {
        const index = state.technologies.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.technologies[index] = action.payload;
        }
      })
      .addCase(deleteTechnology.fulfilled, (state, action) => {
        state.technologies = state.technologies.filter(
          (t) => t.id !== action.payload
        );
      });
  },
});

export const { clearError } = cvProfileSlice.actions;
export default cvProfileSlice.reducer;
