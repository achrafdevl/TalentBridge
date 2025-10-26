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
    <Card className="shadow-lg">
      <SectionHeader
        title="Certifications"
        icon={<FaCertificate />}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="p-6 space-y-6">
          {certifications.map((cert) =>
            editingId === cert.id && editingData ? (
              <div
                key={cert.id}
                className="border-b pb-4 last:border-none space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Issuer"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.issuer}
                    onChange={(e) =>
                      setEditingData({ ...editingData, issuer: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Issue Date"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.issueDate}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        issueDate: e.target.value,
                      })
                    }
                  />
                  <select
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={editingData.credentialUrl || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        credentialUrl: e.target.value,
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
                key={cert.id}
                className="border-b pb-4 last:border-none relative group"
              >
                <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(cert.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleEdit(cert.id)}
                    className="p-2 text-teal-500 hover:bg-teal-50 rounded"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {cert.title}
                  </h4>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      cert.type === "certificat"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {cert.type}
                  </span>
                </div>
                <div className="text-gray-700 font-medium">{cert.issuer}</div>
                <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                  <FaCalendarAlt className="text-teal-500" />
                  <span>{cert.issueDate}</span>
                </div>
                {cert.credentialId && (
                  <div className="text-sm text-gray-600 mt-1">
                    Credential ID: {cert.credentialId}
                  </div>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal-600 hover:underline flex items-center space-x-1 mt-1"
                  >
                    <FaExternalLinkAlt />
                    <span>View Credential</span>
                  </a>
                )}
              </div>
            )
          )}

          {isAdding && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newCertification.issueDate}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      issueDate: e.target.value,
                    })
                  }
                />
                <select
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
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
                  className="text-gray-800 input px-4 py-2 border rounded-lg"
                  value={newCertification.credentialUrl}
                  onChange={(e) =>
                    setNewCertification({
                      ...newCertification,
                      credentialUrl: e.target.value,
                    })
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
              <span>Add New Certification</span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
