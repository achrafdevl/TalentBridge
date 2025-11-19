"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Education } from "@/app/types/education-type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/redux/slices/cvProfileSlice";

export default function EducationSection() {
  const dispatch = useAppDispatch();
  const { education } = useAppSelector((state) => state.cvProfile);

  const emptyEducation: Omit<Education, "id"> = {
    school: "",
    certificate: "",
    startDate: "",
    endDate: "",
    location: "",
  };

  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    ...emptyEducation,
  });
  const [editingData, setEditingData] = useState<Education | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newEducation.school || !newEducation.certificate) return;
    await dispatch(createEducation(newEducation));
    setNewEducation({ ...emptyEducation });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteEducation(id));
  };

  const handleSaveEdit = async (id: string, updated: Omit<Education, "id">) => {
    await dispatch(updateEducation({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const edu = education.find((e) => e.id === id);
    if (edu) setEditingData({ ...edu });
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Education"
        icon={<span>🎓</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-6">
          {education.map((edu) =>
            editingId === edu.id && editingData ? (
              <div
                key={edu.id}
                className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-4"
              >
                <input
                  type="text"
                  placeholder="School"
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={editingData.school}
                  onChange={(e) =>
                    setEditingData({ ...editingData, school: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Certificate"
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={editingData.certificate}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      certificate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={editingData.location || ""}
                  onChange={(e) =>
                    setEditingData({ ...editingData, location: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Start Year"
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.startDate || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="End Year"
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.endDate || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      const { id, ...data } = editingData;
                      handleSaveEdit(id, data);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingData(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={edu.id}
                className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(edu.id)}
                    className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Supprimer"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(edu.id)}
                    className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Modifier"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="pr-24">
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {edu.school}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {edu.certificate}
                  </div>
                  {edu.location && (
                    <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <span>📍</span>
                      {edu.location}
                    </div>
                  )}
                  {edu.startDate && edu.endDate && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📅</span>
                      {edu.startDate} - {edu.endDate}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <input
                type="text"
                placeholder="School"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newEducation.school}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, school: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Certificate"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newEducation.certificate}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    certificate: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Location (Optional)"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newEducation.location}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, location: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Start Year"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="End Year"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mt-4 px-6 py-3 border-2 border-dashed border-[#1C96AD] text-[#1C96AD] rounded-xl flex items-center justify-center space-x-2 hover:bg-[#1C96AD]/5 transition-colors font-medium"
            >
              <FaPlus />
              <span>Ajouter une Formation</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
