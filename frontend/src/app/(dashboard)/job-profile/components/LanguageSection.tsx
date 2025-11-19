"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  Language,
} from "@/redux/slices/cvProfileSlice";

export default function LanguageSection() {
  const dispatch = useAppDispatch();
  const { languages } = useAppSelector((state) => state.cvProfile);

  const emptyLanguage: Omit<Language, "id"> = {
    name: "",
    level: "",
  };

  const [newLanguage, setNewLanguage] = useState<Omit<Language, "id">>({
    ...emptyLanguage,
  });
  const [editingData, setEditingData] = useState<Language | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newLanguage.name || !newLanguage.level) return;
    await dispatch(createLanguage(newLanguage));
    setNewLanguage({ ...emptyLanguage });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteLanguage(id));
  };

  const handleSaveEdit = async (id: string, updated: Omit<Language, "id">) => {
    await dispatch(updateLanguage({ id, data: updated }));
    setEditingIndex(null);
    setEditingData(null);
  };

  const handleEdit = (id: string, idx: number) => {
    setEditingIndex(idx);
    const lang = languages[idx];
    if (lang) setEditingData({ ...lang });
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Languages"
        icon={<span>🌐</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-4">
          {languages.map((lang, idx) =>
            editingIndex === idx && editingData ? (
              <div
                key={lang.id || idx}
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-3"
              >
                <input
                  type="text"
                  placeholder="Language"
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={editingData.name}
                  onChange={(e) =>
                    setEditingData({ ...editingData, name: e.target.value })
                  }
                />
                <select
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={editingData.level}
                  onChange={(e) =>
                    setEditingData({ ...editingData, level: e.target.value })
                  }
                >
                  <option value="">Select Level</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      if (editingData.id) {
                        const { id, ...data } = editingData;
                        handleSaveEdit(id, data);
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
                key={lang.id || idx}
                className="group relative p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    {lang.name}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white/60 rounded-xl border border-gray-200">
                      {lang.level}
                    </span>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => lang.id && handleRemove(lang.id)}
                        className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-sm transition-all hover:scale-110 transform"
                        title="Supprimer"
                      >
                        <FaTrash size={12} />
                      </button>
                      <button
                        onClick={() => handleEdit(lang.id!, idx)}
                        className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-sm transition-all hover:scale-110 transform"
                        title="Modifier"
                      >
                        <FaEdit size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <input
                type="text"
                placeholder="Language"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newLanguage.name}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, name: e.target.value })
                }
              />
              <select
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                value={newLanguage.level}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, level: e.target.value })
                }
              >
                <option value="">Select Level</option>
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
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
              <span>Ajouter une Langue</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
