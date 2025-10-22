"use client";
import * as React from "react";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { UserProfile } from "@/app/types/profile-type";

export default function UserProfileSection() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john@example.com",
    bio: "I am a web developer and designer.",
    location: "Casablanca, Morocco",
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

  const handleSave = () => setIsEditing(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this profile?")) {
      setUserProfile({
        fullName: "",
        email: "",
        bio: "",
        location: "",
        profileImage: "",
        socialLinks: {},
      });
    }
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
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={userProfile.fullName}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={userProfile.email}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={userProfile.location}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Profile Image URL"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                value={userProfile.profileImage}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, profileImage: e.target.value })
                }
              />
              <textarea
                placeholder="Bio"
                className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                rows={3}
                value={userProfile.bio}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, bio: e.target.value })
                }
              />
              {["linkedin", "github", "twitter", "website"].map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                  className="input w-full px-3 py-2 border rounded-lg text-gray-400 text-sm"
                  value={userProfile.socialLinks?.[key as keyof typeof userProfile.socialLinks] || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      socialLinks: {
                        ...userProfile.socialLinks,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              ))}
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-3 py-2 border border-[#1C96AD] rounded-lg text-sm text-[#1C96AD] hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="border-b pb-2 last:border-none relative group">
              <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleDelete}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <FaTrash size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                >
                  <FaEdit size={14} />
                </button>
              </div>
              <div className="font-medium text-gray-700">{userProfile.fullName}</div>
              <div className="text-sm text-gray-500">{userProfile.email}</div>
              {userProfile.location && (
                <div className="text-xs text-gray-400">{userProfile.location}</div>
              )}
              {userProfile.bio && (
                <div className="text-xs text-gray-400">{userProfile.bio}</div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
