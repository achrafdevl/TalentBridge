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
            editingId === edu.id && editingData ? (
              <div key={edu.id} className="space-y-2">
                <input
                  type="text"
                  placeholder="School"
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                  value={editingData.school}
                  onChange={(e) =>
                    setEditingData({ ...editingData, school: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Certificate"
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
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
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                  value={editingData.location || ""}
                  onChange={(e) =>
                    setEditingData({ ...editingData, location: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Year"
                    className="input px-3 py-2 border rounded-lg text-sm"
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
                    className="input px-3 py-2 border rounded-lg text-sm"
                    value={editingData.endDate || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
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
                    onClick={() => handleEdit(edu.id)}
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
