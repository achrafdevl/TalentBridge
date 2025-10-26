"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCompetences,
  createCompetence,
  updateCompetence,
  deleteCompetence,
} from "@/redux/slices/cvProfileSlice";

export interface Competence {
  id?: string;
  name: string;
}

export default function CompetenceSection() {
  const dispatch = useAppDispatch();
  const { competences } = useAppSelector((state) => state.cvProfile);

  const emptyCompetence: Competence = {
    name: "",
  };

  const [newCompetence, setNewCompetence] = useState<Competence>({
    ...emptyCompetence,
  });
  const [editingData, setEditingData] = useState<Competence | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newCompetence.name) return;
    await dispatch(createCompetence(newCompetence));
    setNewCompetence({ ...emptyCompetence });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteCompetence(id));
  };

  const handleSaveEdit = async (id: string, updated: Competence) => {
    await dispatch(updateCompetence({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const comp = competences.find((c) => c.id === id);
    if (comp) setEditingData({ ...comp });
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-red-100 text-red-600 border-red-200";
      case 1:
        return "bg-orange-100 text-orange-600 border-orange-200";
      case 2:
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return "Beginner";
      case 1:
        return "Intermediate";
      case 2:
        return "Expert";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="shadow-lg">
      <SectionHeader
        title="Competences"
        icon={<span>⚡</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {competences.map((c, idx) =>
              editingId === c.id && editingData ? (
                <div
                  key={c.id || idx}
                  className="col-span-2 border rounded p-3 space-y-2"
                >
                  <input
                    type="text"
                    placeholder="Competence Name"
                    className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (editingData.id) {
                          const { id, ...data } = editingData;
                          handleSaveEdit(id, data);
                        }
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
                  key={c.id || idx}
                  className={`px-2 py-1 rounded text-xs border relative group ${getLevelColor(
                    0
                  )}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{c.name}</span>
                  </div>
                  <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(c.id!)}
                      className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => handleEdit(c.id!)}
                      className="bg-teal-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      <FaEdit size={8} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {isAdding && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="Competence Name"
                className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                value={newCompetence.name}
                onChange={(e) =>
                  setNewCompetence({ ...newCompetence, name: e.target.value })
                }
              />
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
              <span>Add Competence</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
