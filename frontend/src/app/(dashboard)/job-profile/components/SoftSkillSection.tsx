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
  Competence,
} from "@/redux/slices/cvProfileSlice";

interface SoftSkill {
  id?: string;
  name: string;
  level: number;
}

export default function SoftSkillSection() {
  const dispatch = useAppDispatch();
  const { competences } = useAppSelector((state) => state.cvProfile);

  const softSkills = competences.filter(
    (c) => c.name !== undefined
  ) as (Competence & { level?: number })[];

  const emptySoftSkill: SoftSkill = {
    name: "",
    level: 0,
  };

  const [newSoftSkill, setNewSoftSkill] = useState<SoftSkill>({
    ...emptySoftSkill,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingData, setEditingData] = useState<SoftSkill | null>(null);

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newSoftSkill.name) return;
    await dispatch(createCompetence({ name: newSoftSkill.name }));
    setNewSoftSkill({ ...emptySoftSkill });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteCompetence(id));
  };

  const handleSaveEdit = async (id: string, updated: { name: string }) => {
    await dispatch(updateCompetence({ id, data: updated }));
    setEditingIndex(null);
    setEditingData(null);
  };

  const handleEdit = (id: string, idx: number) => {
    setEditingIndex(idx);
    const skill = softSkills[idx];
    if (skill) setEditingData({ ...skill, level: 0 });
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
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Soft Skills"
        icon={<span>💡</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {softSkills.map((skill, idx) =>
              editingIndex === idx && editingData ? (
                <div
                  key={skill.id || idx}
                  className="col-span-full p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Soft Skill Name"
                    className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        if (skill.id) {
                          handleSaveEdit(skill.id, { name: editingData.name });
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditingIndex(null);
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
                  key={skill.id || idx}
                  className={`px-4 py-3 rounded-xl border-2 relative group bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 transition-all hover:shadow-lg ${getLevelColor(
                    skill.level || 0
                  )}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-xs opacity-70 px-2 py-1 bg-white/60 rounded-lg">
                      {getLevelLabel(skill.level || 0)}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(skill.id!)}
                      className="p-1.5 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm hover:scale-110 transition-transform"
                      title="Supprimer"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => handleEdit(skill.id!, idx)}
                      className="p-1.5 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 rounded-lg shadow-sm hover:scale-110 transition-transform"
                      title="Modifier"
                    >
                      <FaEdit size={10} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <input
                type="text"
                placeholder="Soft Skill Name"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newSoftSkill.name}
                onChange={(e) =>
                  setNewSoftSkill({ ...newSoftSkill, name: e.target.value })
                }
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
              <span>Ajouter une Compétence Douce</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
