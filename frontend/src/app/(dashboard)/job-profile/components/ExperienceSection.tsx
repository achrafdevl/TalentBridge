"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Experience } from "@/app/types/experience-type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/redux/slices/cvProfileSlice";

export default function ExperienceSection() {
  const dispatch = useAppDispatch();
  const { experiences } = useAppSelector((state) => state.cvProfile);

  const emptyExperience: Omit<Experience, "id"> = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
    technologies: [],
  };

  const [newExperience, setNewExperience] = useState<Omit<Experience, "id">>({
    ...emptyExperience,
  });
  const [editingData, setEditingData] = useState<Experience | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newExperience.company || !newExperience.position) return;
    await dispatch(createExperience(newExperience));
    setNewExperience({ ...emptyExperience });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteExperience(id));
  };

  const handleSaveEdit = async (
    id: string,
    updated: Omit<Experience, "id">
  ) => {
    await dispatch(updateExperience({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const exp = experiences.find((e) => e.id === id);
    if (exp) setEditingData({ ...exp, technologies: exp.technologies || [] });
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Professional Experiences"
        icon={<FaBuilding />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-6">
          {experiences.map((exp) =>
            editingId === exp.id && editingData ? (
              <div
                key={exp.id}
                className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Position"
                    value={editingData.position}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        position: e.target.value,
                      })
                    }
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={editingData.company}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        company: e.target.value,
                      })
                    }
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={editingData.location}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        location: e.target.value,
                      })
                    }
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={editingData.startDate}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        startDate: e.target.value,
                      })
                    }
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={editingData.endDate}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        endDate: e.target.value,
                      })
                    }
                    className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                </div>
                <textarea
                  placeholder="Responsibilities"
                  rows={4}
                  value={editingData.responsibilities}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      responsibilities: e.target.value,
                    })
                  }
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {editingData.technologies?.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingData({
                            ...editingData,
                            technologies:
                              editingData.technologies?.filter(
                                (_, i) => i !== idx
                              ) || [],
                          })
                        }
                        className="ml-2 hover:text-blue-900 transition-colors"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tech"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const newTech = e.currentTarget.value.trim();
                        setEditingData({
                          ...editingData,
                          technologies: [
                            ...(editingData.technologies || []),
                            newTech,
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }}
                    className="input px-3 py-1.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      const { id, ...data } = editingData;
                      handleSaveEdit(id, data);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingData(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={exp.id}
                className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(exp.id)}
                    className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(exp.id)}
                    className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="pr-24">
                  <div className="flex flex-col md:flex-row md:justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {exp.position}
                    </h4>
                    <div className="text-sm text-gray-600 flex items-center space-x-2 mt-2 md:mt-0">
                      <FaCalendarAlt className="text-[#1C96AD]" />
                      <span className="font-medium">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {exp.company}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-2 mb-3">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{exp.location}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 p-4 bg-white/60 rounded-xl border border-gray-200">
                    {exp.responsibilities}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-xs font-medium shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Position"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newExperience.position}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      position: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      company: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newExperience.location}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Start Date"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newExperience.startDate}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="End Date"
                  className="input px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <textarea
                placeholder="Responsibilities"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all resize-none"
                rows={4}
                value={newExperience.responsibilities}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    responsibilities: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const techs = e.currentTarget.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t);
                    setNewExperience({ ...newExperience, technologies: techs });
                    e.currentTarget.value = "";
                  }
                }}
              />
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
              <span>Ajouter une Expérience</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
