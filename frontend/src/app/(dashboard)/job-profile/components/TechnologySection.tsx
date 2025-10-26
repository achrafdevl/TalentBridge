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
    <Card className="shadow-lg">
      <SectionHeader
        title="Technologies"
        icon={<FaCode />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech) =>
              editingId === tech.id && editingData ? (
                <div key={tech.id} className="border rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Technology Name"
                    className="text-gray-800 input w-full px-3 py-2 border rounded-lg text-sm"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g., Frontend, Backend)"
                    className="text-gray-800 input w-full px-3 py-2 border rounded-lg text-sm"
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
                    className="text-gray-800 input w-full px-3 py-2 border rounded-lg text-sm"
                    value={editingData.icon || ""}
                    onChange={(e) =>
                      setEditingData({ ...editingData, icon: e.target.value })
                    }
                  />
                  <select
                    className="text-gray-800 input w-full px-3 py-2 border rounded-lg text-sm"
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const { id, ...data } = editingData;
                        handleSaveEdit(id, data);
                      }}
                      className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingData(null);
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={tech.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                >
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(tech.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash size={12} />
                    </button>
                    <button
                      onClick={() => handleEdit(tech.id)}
                      className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                    >
                      <FaEdit size={12} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{tech.icon || "💻"}</span>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {tech.name}
                      </h5>
                      <p className="text-xs text-gray-500">{tech.category}</p>
                    </div>
                  </div>
                  {tech.level && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getTechLevelColor(
                        tech.level
                      )}`}
                    >
                      {tech.level}
                    </span>
                  )}
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newTechnology.name}
                  onChange={(e) =>
                    setNewTechnology({ ...newTechnology, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Category (e.g., Frontend, Backend)"
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newTechnology.icon}
                  onChange={(e) =>
                    setNewTechnology({ ...newTechnology, icon: e.target.value })
                  }
                />
                <select
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
              <div className="flex space-x-3">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mt-4 px-4 py-3 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-teal-50 transition-colors"
            >
              <FaPlus />
              <span>Add New Technology</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
