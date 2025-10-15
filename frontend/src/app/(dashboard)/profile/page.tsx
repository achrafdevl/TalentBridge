"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateProfile, updatePassword } from "../../../redux/slices/authSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Globe,
  Linkedin,
  Github,
  Camera,
  Edit2,
  Save,
  X,
  Lock,
} from "lucide-react";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [availability, setAvailability] = useState("available");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Populate fields from user
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPhone(user.social_links?.phone || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setSkills(user.social_links?.skills || "");
      setLinkedin(user.social_links?.linkedin || "");
      setGithub(user.social_links?.github || "");
      setAvailability(user.social_links?.availability || "available");
      setProfileImage(user.profile_image || null);
    }
  }, [user]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSave = () => {
    dispatch(
      updateProfile({
        full_name: fullName,
        bio,
        location,
        profile_image: profileImage || undefined,
        social_links: {
          phone,
          skills,
          linkedin,
          github,
          availability,
        },
      })
    );
    setIsEditing(false);
    setSuccessMessage("Profil mis à jour avec succès !");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.social_links?.phone || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setSkills(user.social_links?.skills || "");
      setLinkedin(user.social_links?.linkedin || "");
      setGithub(user.social_links?.github || "");
      setAvailability(user.social_links?.availability || "available");
      setProfileImage(user.profile_image || null);
    }
    setIsEditing(false);
    setLocalError(null);
  };

  const handleUpdatePassword = () => {
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    dispatch(updatePassword({ current_password: currentPassword, new_password: newPassword }))
      .unwrap()
      .then((message) => {
        setPasswordSuccess(message || "Mot de passe mis à jour avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 3000);
      })
      .catch((err) => setPasswordError(err));
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1C96AD] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des données utilisateur...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1C96AD] to-cyan-600 bg-clip-text text-transparent mb-3">
            Mon Profil
          </h1>
          <p className="text-gray-600 text-lg">Gérez vos informations personnelles et professionnelles</p>
        </div>

        {/* Messages */}
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

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="relative h-48 bg-gradient-to-r from-[#1C96AD] via-cyan-500 to-blue-500">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#1C96AD] rounded-full font-semibold hover:bg-white transition-all shadow-lg"
                >
                  <Edit2 size={18} /> Modifier le profil
                </button>
              )}
            </div>
          </div>

          {/* Avatar & Availability */}
          <div className="relative px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 pb-8 border-b border-gray-100">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#1C96AD] to-cyan-400 shadow-2xl flex items-center justify-center text-5xl font-bold text-white border-4 border-white">
                  {fullName ? fullName[0].toUpperCase() : "U"}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-[#1C96AD] text-white rounded-full shadow-lg hover:bg-[#178496] transition-all">
                    <Camera size={18} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium text-sm">
                  {availability === "available"
                    ? "Disponible"
                    : availability === "busy"
                    ? "Occupé"
                    : "Non disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <form className="space-y-10">
              <Section title="Informations Personnelles" icon={<User className="text-[#1C96AD]" />}>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} readOnly={!isEditing} icon={<User size={18} />} placeholder="John Doe" />
                  <FormField label="Email" value={email} readOnly icon={<Mail size={18} />} placeholder="john@example.com" />
                  <FormField label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!isEditing} icon={<Phone size={18} />} placeholder="+33 6 12 34 56 78" />
                  <FormField label="Localisation" value={location} onChange={(e) => setLocation(e.target.value)} readOnly={!isEditing} icon={<MapPin size={18} />} placeholder="Paris, France" />
                </div>
              </Section>

              <Section title="Informations Professionnelles" icon={<Briefcase className="text-[#1C96AD]" />}>
                <TextAreaField label="Bio professionnelle" value={bio} onChange={(e) => setBio(e.target.value)} readOnly={!isEditing} placeholder="Décrivez votre parcours professionnel..." rows={4} />
              </Section>

              <Section title="Compétences & Formation" icon={<Award className="text-[#1C96AD]" />}>
                <TextAreaField label="Compétences" value={skills} onChange={(e) => setSkills(e.target.value)} readOnly={!isEditing} placeholder="React, Node.js, TypeScript..." rows={3} />
              </Section>

              <Section title="Liens & Réseaux" icon={<Globe className="text-[#1C96AD]" />}>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Site Web" value={website} onChange={(e) => setWebsite(e.target.value)} readOnly={!isEditing} icon={<Globe size={18} />} placeholder="https://monsite.com" />
                  <FormField label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} readOnly={!isEditing} icon={<Linkedin size={18} />} placeholder="linkedin.com/in/username" />
                  <FormField label="GitHub" value={github} onChange={(e) => setGithub(e.target.value)} readOnly={!isEditing} icon={<Github size={18} />} placeholder="github.com/username" />
                </div>
              </Section>

              {/* Changer le mot de passe */}
              <Section title="Changer le mot de passe" icon={<Lock className="text-[#1C96AD]" />}>
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700">{passwordSuccess}</div>
                )}
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">{passwordError}</div>
                )}
                <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6">
                  <FormField label="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" readOnly={!isEditing} icon={<Lock size={18} />} />
                  <FormField label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" readOnly={!isEditing} icon={<Lock size={18} />} />
                  <FormField label="Confirmer nouveau mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" readOnly={!isEditing} icon={<Lock size={18} />} />
                </div>
                {isEditing && (
                  <button type="button" onClick={handleUpdatePassword} className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#1C96AD] to-cyan-500 text-white font-semibold hover:shadow-lg transition-all">
                    Mettre à jour le mot de passe
                  </button>
                )}
              </Section>

              {/* Boutons Enregistrer / Annuler */}
              {isEditing && (
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-100">
                  <button type="button" onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#1C96AD] to-cyan-500 text-white font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={20} /> {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                  <button type="button" onClick={handleCancel} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold">
                    <X size={20} /> Annuler
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✨ Components */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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

function FormField({ label, value, onChange, readOnly, icon, placeholder }: { label: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; readOnly?: boolean; icon?: React.ReactNode; placeholder?: string }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full border-2 border-gray-200 rounded-xl ${icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
            readOnly ? "opacity-70 cursor-not-allowed bg-gray-100" : "hover:border-[#1C96AD]/30"
          }`}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, readOnly, placeholder, rows = 4 }: { label: string; value: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; readOnly?: boolean; placeholder?: string; rows?: number }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 resize-none bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all ${
          readOnly ? "opacity-70 cursor-not-allowed bg-gray-100" : "hover:border-[#1C96AD]/30"
        }`}
      />
    </div>
  );
}
