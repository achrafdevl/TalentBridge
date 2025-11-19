"use client";
import UserProfileSection from "./components/UserProfileSection";
import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import CertificationSection from "./components/CertificationSection";
import ProjectSection from "./components/ProjectSection";
import TechnologySection from "./components/TechnologySection";
import CompetenceSection from "./components/CompetenceSection";
import LanguageSection from "./components/LanguageSection";
import SoftSkillSection from "./components/SoftSkillSection";

export default function ProfessionalExperiences() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1C96AD] via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Mon Profile Professionnel
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez et personnalisez votre profil professionnel complet
          </p>
        </div>

        {/* User Profile */}
        <UserProfileSection />

        {/* Professional Experiences */}
        <ExperienceSection />

        {/* Certifications */}
        <CertificationSection />

        {/* Projects */}
        <ProjectSection />

        {/* Technologies */}
        <TechnologySection />

        {/* Grid: Education, Competences, Languages, Soft Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <EducationSection />
          <CompetenceSection />
          <LanguageSection />
          <SoftSkillSection />
        </div>
      </div>
    </div>
  );
}

