"use client";
import * as React from "react";
import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Language } from "@/app/types/language-type";

export default function LanguageSection() {
  const [languages, setLanguages] = useState<Language[]>([
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Spanish", level: "Basic" },
  ]);

  const emptyLanguage: Language = {
    name: "",
    level: "",
  };

  const [newLanguage, setNewLanguage] = useState<Language>({
    ...emptyLanguage,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newLanguage.name || !newLanguage.level) return;
    setLanguages([...languages, newLanguage]);
    setNewLanguage({ ...emptyLanguage });
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSaveEdit = (index: number, updated: Language) => {
    setLanguages(languages.map((lang, i) => (i === index ? updated : lang)));
    setEditingIndex(null);
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
            editingIndex === idx ? (
              <div key={idx} className="border rounded p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Language"
                  className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                  value={lang.name}
                  onChange={(e) =>
                    setLanguages((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, name: e.target.value } : item
                      )
                    )
                  }
                />
                <select
                  className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                  value={lang.level}
                  onChange={(e) =>
                    setLanguages((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, level: e.target.value } : item
                      )
                    )
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
                    onClick={() => handleSaveEdit(idx, lang)}
                    className="flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2 last:border-none relative group"
              >
                <span className="font-medium text-sm text-gray-800">
                  {lang.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{lang.level}</span>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash size={10} />
                    </button>
                    <button
                      onClick={() => setEditingIndex(idx)}
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
