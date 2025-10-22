"use client";
import * as React from "react";
import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Education } from "@/app/types/education-type";

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      school: "University Hassan II",
      certificate: "Master of Multimedia Design & Development",
      startDate: "2018",
      endDate: "2020",
      location: "Casablanca, Morocco",
    },
  ]);

  const emptyEducation: Education = {
    id: "",
    school: "",
    certificate: "",
    startDate: "",
    endDate: "",
    location: "",
  };

  const [newEducation, setNewEducation] = useState<Education>({
    ...emptyEducation,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newEducation.school || !newEducation.certificate) return;
    setEducation([
      ...education,
      { ...newEducation, id: Date.now().toString() },
    ]);
    setNewEducation({ ...emptyEducation });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const handleSaveEdit = (id: string, updated: Education) => {
    setEducation(
      education.map((edu) => (edu.id === id ? { ...updated, id } : edu))
    );
    setEditingId(null);
  };

  return (
    <Card className="shadow-lg">
      <SectionHeader
        title="Education"
        icon={<span>🎓</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-4 space-y-4">
          {education.map((edu) =>
            editingId === edu.id ? (
              <div key={edu.id} className="space-y-2">
                <input
                  type="text"
                  placeholder="School"
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                  value={edu.school}
                  onChange={(e) =>
                    setEducation((prev) =>
                      prev.map((item) =>
                        item.id === edu.id
                          ? { ...item, school: e.target.value }
                          : item
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Certificate"
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                  value={edu.certificate}
                  onChange={(e) =>
                    setEducation((prev) =>
                      prev.map((item) =>
                        item.id === edu.id
                          ? { ...item, certificate: e.target.value }
                          : item
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                  value={edu.location}
                  onChange={(e) =>
                    setEducation((prev) =>
                      prev.map((item) =>
                        item.id === edu.id
                          ? { ...item, location: e.target.value }
                          : item
                      )
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Year"
                    className="input px-3 py-2 border rounded-lg text-sm"
                    value={edu.startDate}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((item) =>
                          item.id === edu.id
                            ? { ...item, startDate: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="End Year"
                    className="input px-3 py-2 border rounded-lg text-sm"
                    value={edu.endDate}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((item) =>
                          item.id === edu.id
                            ? { ...item, endDate: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(edu.id, edu)}
                    className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={edu.id}
                className="border-b pb-2 last:border-none relative group"
              >
                <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(edu.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash size={12} />
                  </button>
                  <button
                    onClick={() => setEditingId(edu.id)}
                    className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                  >
                    <FaEdit size={12} />
                  </button>
                </div>
                <div className="font-medium text-gray-700">{edu.school}</div>
                <div className="text-sm text-gray-500">{edu.certificate}</div>
                {edu.location && (
                  <div className="text-xs text-gray-400">{edu.location}</div>
                )}
                {edu.startDate && edu.endDate && (
                  <div className="text-xs text-gray-400">
                    {edu.startDate} - {edu.endDate}
                  </div>
                )}
              </div>
            )
          )}

          {isAdding && (
            <div className="space-y-2 mt-4">
              <input
                type="text"
                placeholder="School"
                className="input w-full px-3 py-2 border rounded-lg text-sm"
                value={newEducation.school}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, school: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Certificate"
                className="input w-full px-3 py-2 border rounded-lg text-sm"
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
                className="input w-full px-3 py-2 border rounded-lg text-sm"
                value={newEducation.location}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, location: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start Year"
                  className="input px-3 py-2 border rounded-lg text-sm"
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
                  className="input px-3 py-2 border rounded-lg text-sm"
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mt-2 px-4 py-3 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-teal-50 transition-colors"
            >
              <FaPlus />
              <span>Add Education</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
