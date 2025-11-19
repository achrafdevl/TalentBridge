"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  clearError,
} from "@/redux/slices/cvProfileSlice";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { UserProfile } from "@/redux/slices/cvProfileSlice";

export default function UserProfileSection() {
  const dispatch = useAppDispatch();
  const { userProfile, loading, error } = useAppSelector(
    (state) => state.cvProfile
  );

  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({
    fullName: "",
    email: "",
    bio: "",
    location: "",
    profileImage: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      website: "",
    },
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (userProfile) {
      setLocalProfile(userProfile);
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!localProfile.fullName?.trim()) {
        alert("Please enter your full name");
        return;
      }
      if (!localProfile.email?.trim()) {
        alert("Please enter your email");
        return;
      }

      if (userProfile?.id) {
        // Update existing profile
        await dispatch(updateUserProfile(localProfile)).unwrap();
      } else {
        // Create new profile - only send fields that have values
        // Clean socialLinks to remove empty strings
        const cleanedSocialLinks = localProfile.socialLinks
          ? Object.fromEntries(
              Object.entries(localProfile.socialLinks).filter(([, value]) =>
                value?.trim()
              )
            )
          : {};

        const profileToSend = {
          fullName: localProfile.fullName.trim(),
          email: localProfile.email.trim(),
          ...(localProfile.bio?.trim() && { bio: localProfile.bio.trim() }),
          ...(localProfile.location?.trim() && {
            location: localProfile.location.trim(),
          }),
          ...(localProfile.profileImage?.trim() && {
            profileImage: localProfile.profileImage.trim(),
          }),
          ...(Object.keys(cleanedSocialLinks).length > 0 && {
            socialLinks: cleanedSocialLinks,
          }),
        };
        try {
          await dispatch(createUserProfile(profileToSend)).unwrap();
        } catch (createErr) {
          // If profile already exists (400), try to fetch it and then update
          const err = createErr as { message?: string };
          if (err?.message?.includes("already exists")) {
            await dispatch(fetchUserProfile()).unwrap();
            // Now try to update with PUT instead
            await dispatch(updateUserProfile(localProfile)).unwrap();
          } else {
            throw createErr;
          }
        }
      }
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Failed to save profile:", err);
      
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        await dispatch(deleteUserProfile()).unwrap();
        setLocalProfile({
          fullName: "",
          email: "",
          bio: "",
          location: "",
          profileImage: "",
          socialLinks: {},
        });
      } catch (err) {
        console.error("Failed to delete profile:", err);
      }
    }
  };

  const handleCancel = () => {
    // Reset to the original profile data
    if (userProfile) {
      setLocalProfile(userProfile);
    }
    setIsEditing(false);
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="User Profile"
        icon={<span>👤</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 font-medium shadow-sm">
              {error}
            </div>
          )}

          {loading && !isEditing && (
            <div className="text-center py-8 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C96AD] mx-auto mb-3"></div>
              <p>Chargement...</p>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={localProfile.fullName || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={localProfile.email || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={localProfile.location || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Profile Image URL"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={localProfile.profileImage || ""}
                onChange={(e) =>
                  setLocalProfile({
                    ...localProfile,
                    profileImage: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Bio"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all resize-none"
                rows={4}
                value={localProfile.bio || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, bio: e.target.value })
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["linkedin", "github", "twitter", "website"].map((key) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={`${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    } URL`}
                    className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={
                      localProfile.socialLinks?.[
                        key as keyof typeof localProfile.socialLinks
                      ] || ""
                    }
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        socialLinks: {
                          ...localProfile.socialLinks,
                          [key]: e.target.value,
                        },
                      })
                    }
                  />
                ))}
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              {!userProfile && !loading ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">Aucun profil trouvé</p>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      dispatch(clearError());
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                  >
                    Créer un profil
                  </button>
                </div>
              ) : (
                <div className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-lg transition-all">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleDelete}
                      className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                      title="Supprimer le profil"
                    >
                      <FaTrash size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        dispatch(clearError());
                      }}
                      className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                      title="Modifier le profil"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                  <div className="pr-24">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {localProfile.fullName}
                    </div>
                    <div className="text-lg text-gray-600 mb-3">
                      {localProfile.email}
                    </div>
                    {localProfile.location && (
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                        <span>📍</span>
                        {localProfile.location}
                      </div>
                    )}
                    {localProfile.bio && (
                      <div className="text-sm text-gray-600 mt-3 p-4 bg-white/60 rounded-xl border border-gray-200">
                        {localProfile.bio}
                      </div>
                    )}
                    {localProfile.socialLinks && (
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {localProfile.socialLinks.linkedin && (
                          <a
                            href={localProfile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium"
                          >
                            LinkedIn
                          </a>
                        )}
                        {localProfile.socialLinks.github && (
                          <a
                            href={localProfile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
                          >
                            GitHub
                          </a>
                        )}
                        {localProfile.socialLinks.twitter && (
                          <a
                            href={localProfile.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-sky-100 text-sky-700 rounded-xl hover:bg-sky-200 transition-all text-sm font-medium"
                          >
                            Twitter
                          </a>
                        )}
                        {localProfile.socialLinks.website && (
                          <a
                            href={localProfile.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1C96AD]/10 text-[#1C96AD] rounded-xl hover:bg-[#1C96AD]/20 transition-all text-sm font-medium"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
