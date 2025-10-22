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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Mon Portfolio Professionnel
        </h1>

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

