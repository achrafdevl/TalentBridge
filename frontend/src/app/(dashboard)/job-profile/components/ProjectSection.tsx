"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaProjectDiagram,
  FaCalendarAlt,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Project } from "@/app/types/project-type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/redux/slices/cvProfileSlice";

export default function ProjectSection() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.cvProfile);

  const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    technologies: [],
    githubLink: "",
    liveDemo: "",
    tags: [],
    date: "",
  };

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    ...emptyProject,
  });
  const [editingData, setEditingData] = useState<Project | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newProject.title || !newProject.description) return;
    await dispatch(createProject(newProject));
    setNewProject({ ...emptyProject });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteProject(id));
  };

  const handleSaveEdit = async (id: string, updated: Omit<Project, "id">) => {
    await dispatch(updateProject({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const proj = projects.find((p) => p.id === id);
    if (proj) setEditingData({ ...proj });
  };

  const handleAddTech = (projectId?: string) => {
    if (!techInput.trim()) return;
    if (projectId && editingData) {
      setEditingData({
        ...editingData,
        technologies: [...(editingData.technologies || []), techInput.trim()],
      });
    } else {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string, projectId?: string) => {
    if (projectId && editingData) {
      setEditingData({
        ...editingData,
        technologies: editingData.technologies?.filter((t) => t !== tech) || [],
      });
    } else {
      setNewProject({
        ...newProject,
        technologies: newProject.technologies.filter((t) => t !== tech),
      });
    }
  };

  const handleAddTag = (projectId?: string) => {
    if (!tagInput.trim()) return;
    if (projectId && editingData) {
      setEditingData({
        ...editingData,
        tags: [...(editingData.tags || []), tagInput.trim()],
      });
    } else {
      setNewProject({
        ...newProject,
        tags: [...(newProject.tags || []), tagInput.trim()],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string, projectId?: string) => {
    if (projectId && editingData) {
      setEditingData({
        ...editingData,
        tags: editingData.tags?.filter((t) => t !== tag),
      });
    } else {
      setNewProject({
        ...newProject,
        tags: newProject.tags?.filter((t) => t !== tag),
      });
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Projects"
        icon={<FaProjectDiagram />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-6">
          {projects.map((project) =>
            editingId === project.id && editingData ? (
              <div
                key={project.id}
                className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.date}
                    onChange={(e) =>
                      setEditingData({ ...editingData, date: e.target.value })
                    }
                  />
                </div>
                <textarea
                  placeholder="Description"
                  className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all resize-none"
                  rows={3}
                  value={editingData.description}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      description: e.target.value,
                    })
                  }
                />

                {/* Technologies */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Technologies
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add technology"
                      className="input flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech(editingData.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddTech(editingData.id)}
                      className="px-4 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingData.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-sm font-medium shadow-sm flex items-center space-x-1"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => handleRemoveTech(tech, editingData.id)}
                          className="ml-2 hover:text-blue-900 transition-colors"
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tags
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add tag"
                      className="input flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(editingData.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddTag(editingData.id)}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingData.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl text-sm font-medium shadow-sm flex items-center space-x-1"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag, editingData.id)}
                          className="ml-2 hover:text-purple-900 transition-colors"
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="GitHub Link (Optional)"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.githubLink}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        githubLink: e.target.value,
                      })
                    }
                  />
                  <input
                    type="url"
                    placeholder="Live Demo Link (Optional)"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.liveDemo}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        liveDemo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      const { id, ...data } = editingData;
                      handleSaveEdit(id, data);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform font-semibold"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
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
                key={project.id}
                className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(project.id)}
                    className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Supprimer"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Modifier"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="pr-24">
                  <div className="flex flex-col md:flex-row md:justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {project.title}
                    </h4>
                    {project.date && (
                      <div className="text-sm text-gray-600 flex items-center space-x-2 mt-2 md:mt-0">
                        <FaCalendarAlt className="text-[#1C96AD]" />
                        <span className="font-medium">{project.date}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 p-4 bg-white/60 rounded-xl border border-gray-200">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-xs font-medium shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl text-xs font-medium shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-4">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 hover:text-[#1C96AD] flex items-center space-x-2 font-medium transition-colors"
                      >
                        <FaGithub />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1C96AD] hover:text-blue-700 flex items-center space-x-2 font-medium transition-colors"
                      >
                        <FaExternalLinkAlt />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  placeholder="Date"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newProject.date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, date: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Description"
                className="input w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all resize-none"
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />

              {/* Technologies */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Technologies
                </label>
                <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add technology"
                      className="input flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddTech()}
                      className="px-4 py-3 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform"
                    >
                      <FaPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-sm font-medium shadow-sm flex items-center space-x-1"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-2 hover:text-blue-900 transition-colors"
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tags
                </label>
                <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add tag"
                      className="input flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddTag()}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 transform"
                    >
                      <FaPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl text-sm font-medium shadow-sm flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-purple-900 transition-colors"
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="GitHub Link (Optional)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newProject.githubLink}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubLink: e.target.value })
                  }
                />
                <input
                  type="url"
                  placeholder="Live Demo Link (Optional)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newProject.liveDemo}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveDemo: e.target.value })
                  }
                />
              </div>

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
              <span>Ajouter un Projet</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
