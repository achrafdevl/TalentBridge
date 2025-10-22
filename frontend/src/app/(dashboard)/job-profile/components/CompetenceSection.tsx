"use client";
import * as React from "react";
import { useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Competence } from "@/app/types/competence-type";

export default function CompetenceSection() {
  const [competences, setCompetences] = useState<Competence[]>([
    { name: "Branding", level: 2 },
    { name: "User Experience", level: 1 },
    { name: "Graphic Design", level: 0 },
    { name: "Motion Design", level: 1 },
    { name: "Web Development", level: 2 },
  ]);

  const emptyCompetence: Competence = {
    name: "",
    level: 0,
  };

  const [newCompetence, setNewCompetence] = useState<Competence>({
    ...emptyCompetence,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newCompetence.name) return;
    setCompetences([...competences, newCompetence]);
    setNewCompetence({ ...emptyCompetence });
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    setCompetences(competences.filter((_, i) => i !== index));
  };

  const handleSaveEdit = (index: number, updated: Competence) => {
    setCompetences(
      competences.map((comp, i) => (i === index ? updated : comp))
    );
    setEditingIndex(null);
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
              editingIndex === idx ? (
                <div
                  key={idx}
                  className="col-span-2 border rounded p-3 space-y-2"
                >
                  <input
                    type="text"
                    placeholder="Competence Name"
                    className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                    value={c.name}
                    onChange={(e) =>
                      setCompetences((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, name: e.target.value } : item
                        )
                      )
                    }
                  />
                  <select
                    value={c.level}
                    className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                    onChange={(e) =>
                      setCompetences((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? { ...item, level: parseInt(e.target.value) }
                            : item
                        )
                      )
                    }
                  >
                    <option value={0}>Beginner</option>
                    <option value={1}>Intermediate</option>
                    <option value={2}>Expert</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(idx, c)}
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
                  className={`px-2 py-1 rounded text-xs border relative group ${getLevelColor(
                    c.level
                  )}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">
                      {getLevelLabel(c.level)}
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemove(idx)}
                      className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => setEditingIndex(idx)}
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
              <select
                value={newCompetence.level}
                className="input w-full px-3 py-2 border rounded-lg text-sm text-gray-800"
                onChange={(e) =>
                  setNewCompetence({
                    ...newCompetence,
                    level: parseInt(e.target.value),
                  })
                }
              >
                <option value={0}>Beginner</option>
                <option value={1}>Intermediate</option>
                <option value={2}>Expert</option>
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
              <span>Add Competence</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
