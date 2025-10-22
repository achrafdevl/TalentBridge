export type UserProfile = {
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