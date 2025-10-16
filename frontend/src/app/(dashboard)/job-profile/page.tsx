"use client";

import { useState } from "react";
import { FaBuilding, FaUserTie, FaClock, FaTags, FaPlus, FaChevronUp, FaChevronDown, FaExpand } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";

interface Experience {
  id: string;
  company: string;
  position: string;
  responsibilities: string;
}

interface Education {
  id: string;
  school: string;
  certificate: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

export default function ProfessionalExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "Eco Habitat Lux Inc.",
      position: "Creative Art Director",
      responsibilities: "Successfully increased annual revenue to 1M SAR yearly through strategic initiatives..."
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    { id: "1", school: "University Hassan 2", certificate: "Master of Multimedia Design & Development" },
    { id: "2", school: "Creative Art Director", certificate: "Master of Multimedia Design & Development" }
  ]);

  const [competences] = useState([
    { name: "Branding", level: 2 },
    { name: "User Experience", level: 1 },
    { name: "Graphic Design", level: 0 },
    { name: "Motion Design", level: 1 },
    { name: "Web Development", level: 2 },
    { name: "3D Design", level: 2 },
    { name: "Adobe Creative Suite", level: 1 },
    { name: "Illustration", level: 1 },
    { name: "UI Design", level: 0 }
  ]);

  const [skills] = useState([
    { name: "3D Design", level: 2 },
    { name: "Web Development", level: 1 },
    { name: "UI Design", level: 0 }
  ]);

  const [softSkills] = useState([
    { name: "Figma", level: 2 },
    { name: "Photoshop", level: 1 },
    { name: "Illustrator", level: 0 },
    { name: "Framer", level: 1 },
    { name: "Spline", level: 2 },
    { name: "Blender", level: 2 },
    { name: "After Effects", level: 2 },
    { name: "Adobe Premiere Pro", level: 2 },
    { name: "Canvas", level: 1 }
  ]);

  const [languages] = useState([
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Spanish", level: "Basic" }
  ]);

  const [newExperience, setNewExperience] = useState<Experience>({
    id: "",
    company: "",
    position: "",
    responsibilities: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    professionalExperiences: true,
    education: false,
    competences: false,
    skills: false,
    softSkills: false,
    languages: false
  });

  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) return;
    setExperiences([...experiences, { ...newExperience, id: Date.now().toString() }]);
    setNewExperience({ id: "", company: "", position: "", responsibilities: "" });
    setIsAddingExperience(false);
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-red-100 text-red-600 border-red-200";
      case 1: return "bg-orange-100 text-orange-600 border-orange-200";
      case 2: return "bg-green-100 text-green-600 border-green-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Section header reusable component
  const SectionHeader = ({ title, sectionKey, icon }: { title: string; sectionKey: keyof typeof expandedSections; icon: JSX.Element }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => toggleSection(sectionKey)} className="p-1 hover:bg-gray-100 rounded">
          {expandedSections[sectionKey] ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
        </button>
        <button className="p-1 hover:bg-gray-100 rounded"><FaExpand className="text-gray-400 text-xs" /></button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      

      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Experiences Section */}
        <Card className="mb-6 shadow-lg">
          <SectionHeader title="Professional Experiences" sectionKey="professionalExperiences" icon={<FaBuilding className="text-white text-sm" />} />
          {expandedSections.professionalExperiences && (
            <div className="p-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Company</span>
                      </label>
                      <div className="text-gray-800 font-medium">{exp.company}</div>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Position</span>
                      </label>
                      <div className="text-gray-800 font-medium">{exp.position}</div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Responsibilities</span>
                    </label>
                    <div className="text-gray-700 text-sm leading-relaxed">{exp.responsibilities}</div>
                  </div>
                </div>
              ))}

              {isAddingExperience && (
                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Position</span>
                      </label>
                      <input type="text" value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} placeholder="Position is here" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Company</span>
                      </label>
                      <input type="text" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} placeholder="Company name is here" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Responsibilities</span>
                    </label>
                    <textarea value={newExperience.responsibilities} onChange={(e) => setNewExperience({ ...newExperience, responsibilities: e.target.value })} placeholder="Add description" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button onClick={handleAddExperience} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">Save</button>
                    <button onClick={() => setIsAddingExperience(false)} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {!isAddingExperience && (
                <button onClick={() => setIsAddingExperience(true)} className="w-full mt-6 px-4 py-3 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all flex items-center justify-center space-x-2">
                  <FaPlus />
                  <span>Add new Professional Experience</span>
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Grid for Education, Competences, Skills, Soft Skills, Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Education */}
          <Card className="shadow-lg">
            <SectionHeader title="Education" sectionKey="education" icon={<span className="text-white text-xs">🎓</span>} />
            {expandedSections.education && (
              <div className="p-4 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-2">
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">School</span>
                      <div className="mt-1 text-sm">{edu.school}</div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Certificate</span>
                      <div className="mt-1 text-sm">{edu.certificate}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-3 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors">Save</button>
              </div>
            )}
          </Card>

          {/* Competences */}
          <Card className="shadow-lg">
            <SectionHeader title="Competences" sectionKey="competences" icon={<span className="text-white text-xs">⚡</span>} />
            {expandedSections.competences && (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {competences.map((comp, index) => (
                    <div key={index} className={`px-2 py-1 rounded text-xs border ${getLevelColor(comp.level)}`}>{comp.name}</div>
                  ))}
                </div>
                <button className="flex items-center space-x-2 text-teal-600 text-sm hover:bg-teal-50 px-2 py-1 rounded">
                  <FaPlus className="text-xs" />
                  <span>Add New Competence</span>
                </button>
              </div>
            )}
          </Card>

          {/* Skills */}
          <Card className="shadow-lg">
            <SectionHeader title="Skills" sectionKey="skills" icon={<span className="text-white text-xs">⭐</span>} />
            {expandedSections.skills && (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {skills.map((skill, index) => (
                    <div key={index} className={`px-2 py-1 rounded text-xs border ${getLevelColor(skill.level)}`}>{skill.name}</div>
                  ))}
                </div>
                <button className="flex items-center space-x-2 text-teal-600 text-sm hover:bg-teal-50 px-2 py-1 rounded">
                  <FaPlus className="text-xs" />
                  <span>Add New Skill</span>
                </button>
              </div>
            )}
          </Card>

          {/* Soft Skills */}
          <Card className="shadow-lg">
            <SectionHeader title="Soft Skills" sectionKey="softSkills" icon={<span className="text-white text-xs">🔧</span>} />
            {expandedSections.softSkills && (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {softSkills.map((skill, index) => (
                    <div key={index} className={`px-2 py-1 rounded text-xs border ${getLevelColor(skill.level)}`}>{skill.name}</div>
                  ))}
                </div>
                <button className="flex items-center space-x-2 text-teal-600 text-sm hover:bg-teal-50 px-2 py-1 rounded">
                  <FaPlus className="text-xs" />
                  <span>Add New Soft Skill</span>
                </button>
              </div>
            )}
          </Card>

          {/* Languages */}
          <Card className="shadow-lg">
            <SectionHeader title="Languages" sectionKey="languages" icon={<span className="text-white text-xs">🌐</span>} />
            {expandedSections.languages && (
              <div className="p-4 space-y-2 mb-3">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">{lang.name}</span>
                    <select className="text-xs border border-gray-300 rounded px-2 py-1">
                      <option value={lang.level}>{lang.level}</option>
                      <option value="Basic">Basic</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                ))}
                <button className="flex items-center space-x-2 text-teal-600 text-sm hover:bg-teal-50 px-2 py-1 rounded">
                  <FaPlus className="text-xs" />
                  <span>Add New Language</span>
                </button>
              </div>
            )}
          </Card>
        </div>

        
      </div>
    </div>
  );
}
