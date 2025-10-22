"use client";
import * as React from "react";
import { useState } from "react";
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

export default function CertificationSection() {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2023-06",
      type: "certificat",
      credentialId: "AWS-12345",
      credentialUrl: "https://aws.amazon.com/certification",
    },
  ]);

  const emptyCertification: Certification = {
    id: "",
    title: "",
    issuer: "",
    issueDate: "",
    type: "certificat",
    credentialId: "",
    credentialUrl: "",
  };

  const [newCertification, setNewCertification] = useState<Certification>({
    ...emptyCertification,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newCertification.title || !newCertification.issuer) return;
    setCertifications([
      ...certifications,
      { ...newCertification, id: Date.now().toString() },
    ]);
    setNewCertification({ ...emptyCertification });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const handleSaveEdit = (id: string, updated: Certification) => {
    setCertifications(
      certifications.map((cert) => (cert.id === id ? { ...updated, id } : cert))
    );
    setEditingId(null);
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
            editingId === cert.id ? (
              <div
                key={cert.id}
                className="border-b pb-4 last:border-none space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.title}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? { ...item, title: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Issuer"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.issuer}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? { ...item, issuer: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <input
                    type="date"
                    placeholder="Issue Date"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.issueDate}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? { ...item, issueDate: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <select
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.type}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? {
                                ...item,
                                type: e.target.value as
                                  | "certificat"
                                  | "diplôme",
                              }
                            : item
                        )
                      )
                    }
                  >
                    <option value="certificat">Certificate</option>
                    <option value="diplôme">Diploma</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Credential ID (Optional)"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.credentialId}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? { ...item, credentialId: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <input
                    type="url"
                    placeholder="Credential URL (Optional)"
                    className="text-gray-800 input px-4 py-2 border rounded-lg"
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((item) =>
                          item.id === cert.id
                            ? { ...item, credentialUrl: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSaveEdit(cert.id, cert)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
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
                    onClick={() => setEditingId(cert.id)}
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
