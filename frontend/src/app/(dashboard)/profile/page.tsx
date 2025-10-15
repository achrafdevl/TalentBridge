"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateProfile } from "../../../redux/slices/authSlice";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar,
  Globe,
  Linkedin,
  Github,
  Camera,
  Edit2,
  Save,
  X
} from "lucide-react";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState("available");
  
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setSkills(user.skills || "");
      setWebsite(user.website || "");
      setLinkedin(user.linkedin || "");
      setGithub(user.github || "");
      setLanguages(user.languages || "");
      setAvailability(user.availability || "available");
    }
  }, [user]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSave = () => {
    dispatch(
      updateProfile({
        full_name: fullName,
        phone,
        location,
        bio,
        skills,
        job_title: jobTitle,
        company,
        experience,
        education,
        website,
        linkedin,
        github,
        languages,
        availability,
      })
    );
    setIsEditing(false);
    setSuccessMessage("Profil mis à jour avec succès !");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setSkills(user.skills || "");
      setEducation(user.education || "");
      setWebsite(user.website || "");
      setLinkedin(user.linkedin || "");
      setGithub(user.github || "");
      setLanguages(user.languages || "");
      setAvailability(user.availability || "available");
    }
    setIsEditing(false);
    setLocalError(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1C96AD] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des données utilisateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1C96AD] to-cyan-600 bg-clip-text text-transparent mb-3">
            Mon Profil
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>

        {/* Alert Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm animate-fade-in">
            <p className="text-green-700 font-medium flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              {successMessage}
            </p>
          </div>
        )}

        {localError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <p className="text-red-700 font-medium flex items-center gap-2">
              <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              {localError}
            </p>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Cover Image with Gradient */}
          <div className="relative h-48 bg-gradient-to-r from-[#1C96AD] via-cyan-500 to-blue-500">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#1C96AD] rounded-full font-semibold hover:bg-white transition-all shadow-lg"
                >
                  <Edit2 size={18} />
                  Modifier le profil
                </button>
              )}
            </div>
          </div>

          {/* Avatar Section */}
          <div className="relative px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 pb-8 border-b border-gray-100">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#1C96AD] to-cyan-400 shadow-2xl flex items-center justify-center text-5xl font-bold text-white border-4 border-white">
                  {user.full_name ? user.full_name[0].toUpperCase() : "U"}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-[#1C96AD] text-white rounded-full shadow-lg hover:bg-[#178496] transition-all">
                    <Camera size={18} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {user.full_name}
                </h2>
                <p className="text-lg text-gray-600 mb-2">{jobTitle || "Professionnel"}</p>
                {company && (
                  <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                    <Briefcase size={16} />
                    {company}
                  </p>
                )}
              </div>

              {/* Availability Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium text-sm">
                  {availability === "available" ? "Disponible" : 
                   availability === "busy" ? "Occupé" : "Non disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-10">
            <form className="space-y-10">
              {/* Section: Informations Personnelles */}
              <Section title="Informations Personnelles" icon={<User className="text-[#1C96AD]" />}>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    readOnly={!isEditing}
                    icon={<User size={18} />}
                    placeholder="John Doe"
                  />
                  <FormField
                    label="Email"
                    value={email}
                    readOnly
                    icon={<Mail size={18} />}
                    placeholder="john@example.com"
                  />
                  <FormField
                    label="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!isEditing}
                    icon={<Phone size={18} />}
                    placeholder="+33 6 12 34 56 78"
                  />
                  <FormField
                    label="Localisation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    readOnly={!isEditing}
                    icon={<MapPin size={18} />}
                    placeholder="Paris, France"
                  />
                </div>
              </Section>

              {/* Section: Informations Professionnelles */}
              <Section title="Informations Professionnelles" icon={<Briefcase className="text-[#1C96AD]" />}>
                
                <TextAreaField
                  label="Bio professionnelle"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  readOnly={!isEditing}
                  placeholder="Décrivez votre parcours professionnel et vos objectifs..."
                  rows={4}
                />
              </Section>

              {/* Section: Compétences et Formation */}
              <Section title="Compétences & Formation" icon={<Award className="text-[#1C96AD]" />}>
                <div className="space-y-6">
                  <TextAreaField
                    label="Compétences"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    readOnly={!isEditing}
                    placeholder="React, Node.js, TypeScript, Python..."
                    rows={3}
                  />
                  <TextAreaField
                    label="Formation"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    readOnly={!isEditing}
                    placeholder="Master en Informatique, Université de Paris"
                    rows={3}
                  />
                  <FormField
                    label="Langues"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    readOnly={!isEditing}
                    icon={<Globe size={18} />}
                    placeholder="Français (natif), Anglais (courant), Espagnol (intermédiaire)"
                  />
                </div>
              </Section>

              {/* Section: Liens Sociaux */}
              <Section title="Liens & Réseaux" icon={<Globe className="text-[#1C96AD]" />}>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Site Web"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    readOnly={!isEditing}
                    icon={<Globe size={18} />}
                    placeholder="https://monsite.com"
                  />
                  <FormField
                    label="LinkedIn"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    readOnly={!isEditing}
                    icon={<Linkedin size={18} />}
                    placeholder="linkedin.com/in/username"
                  />
                  <FormField
                    label="GitHub"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    readOnly={!isEditing}
                    icon={<Github size={18} />}
                    placeholder="github.com/username"
                  />
                </div>
              </Section>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#1C96AD] to-cyan-500 text-white font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                  >
                    <X size={20} />
                    Annuler
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1C96AD] rounded-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Complétez votre profil</h3>
              <p className="text-gray-600 text-sm">
                Un profil complet augmente vos chances d'être trouvé par les recruteurs et améliore votre visibilité professionnelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✨ Reusable Components */
function Section({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-100">
        {icon}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  readOnly,
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full border-2 border-gray-200 rounded-xl ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
            readOnly ? "opacity-70 cursor-not-allowed bg-gray-100" : "hover:border-[#1C96AD]/30"
          }`}
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
          readOnly ? "opacity-70 cursor-not-allowed bg-gray-100" : "hover:border-[#1C96AD]/30"
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  readOnly,
  options,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  readOnly?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={readOnly}
        className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
          readOnly ? "opacity-70 cursor-not-allowed bg-gray-100" : "hover:border-[#1C96AD]/30"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
