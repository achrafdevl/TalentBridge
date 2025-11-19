"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCertificate,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import SectionHeader from "@/app/(dashboard)/job-profile/components/SectionHeader";
import type { Certification } from "@/app/types/certification-type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/redux/slices/cvProfileSlice";

export default function CertificationSection() {
  const dispatch = useAppDispatch();
  const { certifications } = useAppSelector((state) => state.cvProfile);

  const emptyCertification: Omit<Certification, "id"> = {
    title: "",
    issuer: "",
    issueDate: "",
    type: "certificat",
    credentialId: "",
    credentialUrl: "",
  };

  const [newCertification, setNewCertification] = useState<
    Omit<Certification, "id">
  >({
    ...emptyCertification,
  });
  const [editingData, setEditingData] = useState<Certification | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchCertifications());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newCertification.title || !newCertification.issuer) return;
    await dispatch(createCertification(newCertification));
    setNewCertification({ ...emptyCertification });
    setIsAdding(false);
  };

  const handleRemove = async (id: string) => {
    await dispatch(deleteCertification(id));
  };

  const handleSaveEdit = async (
    id: string,
    updated: Omit<Certification, "id">
  ) => {
    await dispatch(updateCertification({ id, data: updated }));
    setEditingId(null);
    setEditingData(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const cert = certifications.find((c) => c.id === id);
    if (cert) setEditingData({ ...cert });
  };

  return (
    <Card className="shadow-xl border-0 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <SectionHeader
        title="Certifications"
        icon={<FaCertificate />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-8 space-y-6">
          {certifications.map((cert) =>
            editingId === cert.id && editingData ? (
              <div
                key={cert.id}
                className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Issuer"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.issuer}
                    onChange={(e) =>
                      setEditingData({ ...editingData, issuer: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Issue Date"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.issueDate}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        issueDate: e.target.value,
                      })
                    }
                  />
                  <select
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.type}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        type: e.target.value as "certificat" | "diplôme",
                      })
                    }
                  >
                    <option value="certificat">Certificate</option>
                    <option value="diplôme">Diploma</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Credential ID (Optional)"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.credentialId || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        credentialId: e.target.value,
                      })
                    }
                  />
                  <input
                    type="url"
                    placeholder="Credential URL (Optional)"
                    className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                    value={editingData.credentialUrl || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        credentialUrl: e.target.value,
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
                key={cert.id}
                className="group relative p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(cert.id)}
                    className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Supprimer"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(cert.id)}
                    className="p-2 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all hover:scale-110 transform"
                    title="Modifier"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="pr-24">
                  <div className="flex flex-col md:flex-row md:justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {cert.title}
                    </h4>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium mt-2 md:mt-0 ${
                        cert.type === "certificat"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {cert.type}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {cert.issuer}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-2 mb-3">
                    <FaCalendarAlt className="text-[#1C96AD]" />
                    <span>{cert.issueDate}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="text-sm text-gray-600 mb-2 p-3 bg-white/60 rounded-xl border border-gray-200">
                      <span className="font-medium">Credential ID:</span> {cert.credentialId}
                    </div>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-[#1C96AD] hover:text-blue-700 font-medium transition-colors"
                    >
                      <FaExternalLinkAlt />
                      <span>Voir le Certificat</span>
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
                  placeholder="Title"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.title}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      title: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.issuer}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      issuer: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  placeholder="Issue Date"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.issueDate}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      issueDate: e.target.value,
                    })
                  }
                />
                <select
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.type}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      type: e.target.value as "certificat" | "diplôme",
                    })
                  }
                >
                  <option value="certificat">Certificate</option>
                  <option value="diplôme">Diploma</option>
                </select>
                <input
                  type="text"
                  placeholder="Credential ID (Optional)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.credentialId}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      credentialId: e.target.value,
                    })
                  }
                />
                <input
                  type="url"
                  placeholder="Credential URL (Optional)"
                  className="text-gray-800 input px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1C96AD] focus:ring-2 focus:ring-[#1C96AD]/20 transition-all"
                  value={newCertification.credentialUrl}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      credentialUrl: e.target.value,
                    })
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
              <span>Ajouter une Certification</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
