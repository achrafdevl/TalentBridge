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
    <Card className="shadow-lg">
      <SectionHeader
        title="Languages"
        icon={<span>🌐</span>}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-4 space-y-2">
          {languages.map((lang, idx) =>
            editingIndex === idx && editingData ? (
              <div
                key={lang.id || idx}
                className="border rounded p-3 space-y-2"
              >
                <input
                  type="text"
                  placeholder="Language"
                  className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                  value={editingData.name}
                  onChange={(e) =>
                    setEditingData({ ...editingData, name: e.target.value })
                  }
                />
                <select
                  className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
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
                      setEditingIndex(null);
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
                key={lang.id || idx}
                className="flex justify-between items-center border-b pb-2 last:border-none relative group"
              >
                <span className="font-medium text-sm text-gray-800">
                  {lang.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{lang.level}</span>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => lang.id && handleRemove(lang.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash size={10} />
                    </button>
                    <button
                      onClick={() => handleEdit(lang.id!, idx)}
                      className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                    >
                      <FaEdit size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {isAdding && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="Language"
                className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                value={newLanguage.name}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, name: e.target.value })
                }
              />
              <select
                className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
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
              <span>Add Language</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
