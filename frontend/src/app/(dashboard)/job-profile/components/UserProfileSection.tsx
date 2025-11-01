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
    <Card className="shadow-lg">
      <SectionHeader
        title="User Profile"
        icon={<span>👤</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {loading && !isEditing && (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          )}

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={localProfile.fullName || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={localProfile.email || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={localProfile.location || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Profile Image URL"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
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
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                rows={3}
                value={localProfile.bio || ""}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, bio: e.target.value })
                }
              />
              {["linkedin", "github", "twitter", "website"].map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={`${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  } URL`}
                  className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
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
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-[#1C96AD] rounded-lg text-sm text-[#1C96AD] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {!userProfile && !loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No profile found</p>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      // Clear any error state when starting to edit
                      dispatch(clearError());
                    }}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                  >
                    Create Profile
                  </button>
                </div>
              ) : (
                <div className="border-b pb-2 last:border-none relative group">
                  <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleDelete}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Delete profile"
                    >
                      <FaTrash size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        dispatch(clearError());
                      }}
                      className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                      title="Edit profile"
                    >
                      <FaEdit size={14} />
                    </button>
                  </div>
                  <div className="font-medium text-gray-700">
                    {localProfile.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {localProfile.email}
                  </div>
                  {localProfile.location && (
                    <div className="text-xs text-gray-400">
                      {localProfile.location}
                    </div>
                  )}
                  {localProfile.bio && (
                    <div className="text-xs text-gray-400 mt-2">
                      {localProfile.bio}
                    </div>
                  )}
                  {localProfile.socialLinks && (
                    <div className="flex gap-2 mt-2">
                      {localProfile.socialLinks.linkedin && (
                        <a
                          href={localProfile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      {localProfile.socialLinks.github && (
                        <a
                          href={localProfile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {localProfile.socialLinks.twitter && (
                        <a
                          href={localProfile.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Twitter
                        </a>
                      )}
                      {localProfile.socialLinks.website && (
                        <a
                          href={localProfile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-teal-500 hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
