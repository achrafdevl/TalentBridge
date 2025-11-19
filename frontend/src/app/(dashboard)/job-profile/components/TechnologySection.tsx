"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaCode } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Technology } from "@/app/types/technology-type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "@/redux/slices/cvProfileSlice";

export default function TechnologySection() {
  const dispatch = useAppDispatch();
  const { technologies } = useAppSelector((state) => state.cvProfile);

  const emptyTechnology: Omit<Technology, "id"> = {
    name: "",
    category: "",
    icon: "",
    level: "Intermediate",
  };

  const [newTechnology, setNewTechnology] = useState<Omit<Technology, "id">>({
    ...emptyTechnology,
  });
  const [editingData, setEditingData] = useState<Technology | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchTechnologies());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newTechnology.name || !newTechnology.category) return;
    await dispatch(createTechnology(newTechnology));
    setNewTechnology({ ...emptyTechnology });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteTechnology(id));
  };

  const handleSaveEdit = async (
    id: string,
    updated: Omit<Technology, "id">
  ) => {
    await dispatch(updateTechnology({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const tech = technologies.find((t) => t.id === id);
    if (tech) setEditingData({ ...tech, level: tech.level || "Intermediate" });
  };

  const getTechLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-red-100 text-red-600";
      case "Intermediate":
        return "bg-orange-100 text-orange-600";
      case "Advanced":
        return "bg-blue-100 text-blue-600";
      case "Expert":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Technologies"
        icon={<FaCode />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech) =>
              editingId === tech.id && editingData ? (
                <div key={tech.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-4">
                  <input
                    type="text"
                    placeholder="Technology Name"
                    className="text-gray-800 input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g., Frontend, Backend)"
                    className="text-gray-800 input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.category}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        category: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Icon (emoji)"
                    className="text-gray-800 input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.icon || ""}
                    onChange={(e) =>
                      setEditingData({ ...editingData, icon: e.target.value })
                    }
                  />
                  <select
                    className="text-gray-800 input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.level || "Intermediate"}
                    onChange={(e) =>
                      setEditingData({ ...editingData, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
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
                  key={tech.id}
                  className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(tech.id)}
                      className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                      title="Supprimer"
                    >
                      <FaTrash size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(tech.id)}
                      className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                  <div className="pr-24">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{tech.icon || "💻"}</span>
                      <div>
                        <h5 className="text-lg font-bold text-gray-900">
                          {tech.name}
                        </h5>
                        <p className="text-sm text-gray-600">{tech.category}</p>
                      </div>
                    </div>
                    {tech.level && (
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${getTechLevelColor(
                          tech.level
                        )}`}
                      >
                        {tech.level}
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Technology Name"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newTechnology.name}
                  onChange={(e) =>
                    setNewTechnology({ ...newTechnology, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Category (e.g., Frontend, Backend)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newTechnology.category}
                  onChange={(e) =>
                    setNewTechnology({
                      ...newTechnology,
                      category: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newTechnology.icon}
                  onChange={(e) =>
                    setNewTechnology({ ...newTechnology, icon: e.target.value })
                  }
                />
                <select
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newTechnology.level}
                  onChange={(e) =>
                    setNewTechnology({
                      ...newTechnology,
                      level: e.target.value,
                    })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
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
              <span>Ajouter une Technologie</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
