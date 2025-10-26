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
    <Card className="shadow-lg">
      <SectionHeader
        title="Projects"
        icon={<FaProjectDiagram />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-6 space-y-6">
          {projects.map((project) =>
            editingId === project.id && editingData ? (
              <div
                key={project.id}
                className="border-b pb-4 last:border-none space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.date}
                    onChange={(e) =>
                      setEditingData({ ...editingData, date: e.target.value })
                    }
                  />
                </div>
                <textarea
                  placeholder="Description"
                  className="input w-full px-4 py-2 border rounded-lg text-gray-800"
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
                      className="input flex-1 px-4 py-2 border rounded-lg text-gray-800"
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
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingData.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-xs flex items-center space-x-1"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => handleRemoveTech(tech, editingData.id)}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          ×
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
                      className="input flex-1 px-4 py-2 border rounded-lg text-gray-800"
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
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingData.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center space-x-1"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag, editingData.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="GitHub Link (Optional)"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.liveDemo}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        liveDemo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const { id, ...data } = editingData;
                      handleSaveEdit(id, data);
                    }}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingData(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={project.id}
                className="border-b pb-4 last:border-none relative group"
              >
                <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(project.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="p-2 text-teal-500 hover:bg-teal-50 rounded"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {project.title}
                  </h4>
                  {project.date && (
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <FaCalendarAlt className="text-teal-500" />
                      <span>{project.date}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {project.description}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-xs"
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
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
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
                      className="text-sm text-gray-700 hover:text-teal-600 flex items-center space-x-1"
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
                      className="text-sm text-teal-600 hover:underline flex items-center space-x-1"
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </a>
                  )}
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  placeholder="Date"
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newProject.date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, date: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Description"
                className="input w-full px-4 py-2 border rounded-lg text-gray-800"
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
                    className="input flex-1 px-4 py-2 border rounded-lg text-gray-800"
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
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-xs flex items-center space-x-1"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        ×
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
                    className="input flex-1 px-4 py-2 border rounded-lg text-gray-800"
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
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="GitHub Link (Optional)"
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newProject.githubLink}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubLink: e.target.value })
                  }
                />
                <input
                  type="url"
                  placeholder="Live Demo Link (Optional)"
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newProject.liveDemo}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveDemo: e.target.value })
                  }
                />
              </div>

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
              <span>Add New Project</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
