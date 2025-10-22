"use client";
import * as React from "react";
import { useState } from "react";
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

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "Eco Habitat Lux Inc.",
      position: "Creative Art Director",
      location: "Casablanca, Morocco",
      startDate: "Jan 2022",
      endDate: "Present",
      responsibilities:
        "Successfully increased annual revenue to 1M MAD through design strategy and cross-team collaboration.",
      technologies: ["Figma", "Adobe XD", "React"],
    },
  ]);

  const emptyExperience: Experience = {
    id: "",
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
    technologies: [],
  };

  const [newExperience, setNewExperience] = useState<Experience>({
    ...emptyExperience,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newExperience.company || !newExperience.position) return;
    setExperiences([
      ...experiences,
      { ...newExperience, id: Date.now().toString() },
    ]);
    setNewExperience({ ...emptyExperience });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleSaveEdit = (id: string, updated: Experience) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...updated, id } : exp))
    );
    setEditingId(null);
  };

  return (
    <Card className="shadow-lg">
      <SectionHeader
        title="Professional Experiences"
        icon={<FaBuilding />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-6 space-y-6">
          {experiences.map((exp) =>
            editingId === exp.id ? (
              <div
                key={exp.id}
                className="border-b pb-4 last:border-none space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, position: e.target.value }
                            : item
                        )
                      )
                    }
                    className="input px-4 py-2 border rounded-lg text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, company: e.target.value }
                            : item
                        )
                      )
                    }
                    className="input px-4 py-2 border rounded-lg text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, location: e.target.value }
                            : item
                        )
                      )
                    }
                    className="input px-4 py-2 border rounded-lg text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, startDate: e.target.value }
                            : item
                        )
                      )
                    }
                    className="input px-4 py-2 border rounded-lg text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) =>
                      setExperiences((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, endDate: e.target.value }
                            : item
                        )
                      )
                    }
                    className="input px-4 py-2 border rounded-lg text-gray-800"
                  />
                </div>
                <textarea
                  placeholder="Responsibilities"
                  rows={3}
                  value={exp.responsibilities}
                  onChange={(e) =>
                    setExperiences((prev) =>
                      prev.map((item) =>
                        item.id === exp.id
                          ? { ...item, responsibilities: e.target.value }
                          : item
                      )
                    )
                  }
                  className="input w-full px-4 py-2 border rounded-lg text-gray-800"
                />
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setExperiences((prev) =>
                            prev.map((item) =>
                              item.id === exp.id
                                ? {
                                    ...item,
                                    technologies: item.technologies.filter(
                                      (_, i) => i !== idx
                                    ),
                                  }
                                : item
                            )
                          )
                        }
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
                        setExperiences((prev) =>
                          prev.map((item) =>
                            item.id === exp.id
                              ? {
                                  ...item,
                                  technologies: [...item.technologies, newTech],
                                }
                              : item
                          )
                        );
                        e.currentTarget.value = "";
                      }
                    }}
                    className="input px-2 py-1 border rounded text-xs"
                  />
                </div>
                <div className="flex space-x-3 mt-2">
                  <button
                    onClick={() => handleSaveEdit(exp.id, exp)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={exp.id}
                className="border-b pb-4 last:border-none relative group"
              >
                <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(exp.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setEditingId(exp.id)}
                    className="p-2 text-teal-500 hover:bg-teal-50 rounded"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between mb-1">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {exp.position}
                  </h4>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <FaCalendarAlt className="text-teal-500" />
                    <span>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 font-medium">{exp.company}</div>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{exp.location}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {exp.responsibilities}
                </p>
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Position"
                  className="input px-4 py-2 border rounded-lg text-gray-800"
                  value={newExperience.position}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, position: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="input px-4 py-2 border rounded-lg text-gray-800"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, company: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="input px-4 py-2 border rounded-lg text-gray-800"
                  value={newExperience.location}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, location: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Start Date"
                  className="input px-4 py-2 border rounded-lg text-gray-800"
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
                  className="input px-4 py-2 border rounded-lg text-gray-800"
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, endDate: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Responsibilities"
                className="input w-full px-4 py-2 border rounded-lg text-gray-800"
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
                className="input w-full px-4 py-2 border rounded-lg text-gray-800"
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
              <span>Add New Experience</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
