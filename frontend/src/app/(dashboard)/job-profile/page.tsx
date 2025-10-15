"use client";

import { useState } from "react";
import { 
  FaUser, 
  FaBriefcase, 
  FaGraduationCap, 
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";

interface JobPreference {
  id: string;
  title: string;
  location: string;
  salaryRange: string;
  jobType: string;
  industry: string;
}

export default function JobProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<JobPreference[]>([
    {
      id: "1",
      title: "Développeur Full Stack",
      location: "Paris, France",
      salaryRange: "45k - 65k €",
      jobType: "CDI",
      industry: "Tech"
    },
    {
      id: "2", 
      title: "Ingénieur Frontend",
      location: "Lyon, France",
      salaryRange: "40k - 55k €",
      jobType: "CDI",
      industry: "Startup"
    }
  ]);

  const [formData, setFormData] = useState({
    desiredPosition: "Développeur Full Stack Senior",
    preferredLocation: "Paris, France",
    salaryExpectation: "55k - 75k €",
    jobType: "CDI",
    workMode: "Hybride",
    availability: "Immédiate",
    industries: "Tech, Fintech, E-commerce",
    skills: "React, Node.js, TypeScript, Python, AWS"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous pourriez envoyer les données vers votre API
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil Professionnel</h1>
          <p className="text-gray-500 mt-2">
            Gérez vos préférences de carrière et objectifs professionnels
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-6 py-3 bg-[#1C96AD] text-white rounded-xl hover:bg-[#178496] transition-all shadow-lg"
        >
          {isEditing ? <FaTimes /> : <FaEdit />}
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </div>

      {/* Informations principales */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#1C96AD] rounded-2xl">
              <FaBriefcase className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Objectifs de carrière</h2>
          </div>

          <div className="space-y-6">
            <FormField
              label="Poste recherché"
              icon={FaBriefcase}
              value={formData.desiredPosition}
              onChange={(value) => setFormData({...formData, desiredPosition: value})}
              readOnly={!isEditing}
            />
            
            <FormField
              label="Localisation préférée"
              icon={FaMapMarkerAlt}
              value={formData.preferredLocation}
              onChange={(value) => setFormData({...formData, preferredLocation: value})}
              readOnly={!isEditing}
            />

            <FormField
              label="Attentes salariales"
              icon={FaDollarSign}
              value={formData.salaryExpectation}
              onChange={(value) => setFormData({...formData, salaryExpectation: value})}
              readOnly={!isEditing}
            />
          </div>
        </Card>

        <Card className="p-8 shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-emerald-500 rounded-2xl">
              <FaClock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Conditions de travail</h2>
          </div>

          <div className="space-y-6">
            <FormField
              label="Type de contrat"
              icon={FaBriefcase}
              value={formData.jobType}
              onChange={(value) => setFormData({...formData, jobType: value})}
              readOnly={!isEditing}
            />

            <FormField
              label="Mode de travail"
              icon={FaMapMarkerAlt}
              value={formData.workMode}
              onChange={(value) => setFormData({...formData, workMode: value})}
              readOnly={!isEditing}
            />

            <FormField
              label="Disponibilité"
              icon={FaClock}
              value={formData.availability}
              onChange={(value) => setFormData({...formData, availability: value})}
              readOnly={!isEditing}
            />
          </div>
        </Card>
      </div>

      {/* Secteurs d'activité et compétences */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <FaGraduationCap className="text-[#1C96AD]" />
            Secteurs d'intérêt
          </h3>
          <TextAreaField
            value={formData.industries}
            onChange={(value) => setFormData({...formData, industries: value})}
            readOnly={!isEditing}
            placeholder="Ex: Tech, Fintech, E-commerce..."
          />
        </Card>

        <Card className="p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <FaUser className="text-[#1C96AD]" />
            Compétences clés
          </h3>
          <TextAreaField
            value={formData.skills}
            onChange={(value) => setFormData({...formData, skills: value})}
            readOnly={!isEditing}
            placeholder="Ex: React, Node.js, TypeScript..."
          />
        </Card>
      </div>

      {/* Préférences de poste sauvegardées */}
      <Card className="p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <FaBriefcase className="text-[#1C96AD]" />
            Préférences sauvegardées
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all">
            <FaPlus />
            Ajouter
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {preferences.map((pref) => (
            <div key={pref.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-lg mb-2">{pref.title}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt /> {pref.location}
                </p>
                <p className="flex items-center gap-2">
                  <FaDollarSign /> {pref.salaryRange}
                </p>
                <p className="flex items-center gap-2">
                  <FaBriefcase /> {pref.jobType} • {pref.industry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Boutons d'action */}
      {isEditing && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-[#1C96AD] text-white rounded-xl hover:bg-[#178496] transition-all shadow-lg"
          >
            <FaSave />
            Enregistrer les modifications
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            <FaTimes />
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
}

function FormField({ label, icon: Icon, value, onChange, readOnly }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="text-[#1C96AD]" />
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
          readOnly ? "opacity-70 cursor-not-allowed bg-gray-50" : ""
        }`}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  placeholder?: string;
}

function TextAreaField({ value, onChange, readOnly, placeholder }: TextAreaFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      rows={4}
      className={`w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all resize-none ${
        readOnly ? "opacity-70 cursor-not-allowed bg-gray-50" : ""
      }`}
    />
  );
}