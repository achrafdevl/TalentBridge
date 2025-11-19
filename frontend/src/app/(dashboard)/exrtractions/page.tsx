"use client";

import React, { useMemo, useState } from "react";
import {
  FaUpload,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { uploadCV, getCvDetails } from "@/services/api";

type EntitiesMap = Record<string, string[]>;

interface StructuredExperienceBlock {
  title?: string;
  company?: string;
  date?: string;
  location?: string;
}

interface StructuredEducationBlock {
  degree?: string;
  school?: string;
  date?: string;
  location?: string;
}

interface StructuredEntitiesPayload {
  raw?: Record<string, unknown>;
  structured?: {
    EXPERIENCE_BLOCKS?: unknown;
    EDUCATION_BLOCKS?: unknown;
  };
}

type ExtractedEntities = EntitiesMap | StructuredEntitiesPayload;

interface CvDetails {
  _id: string;
  filename: string;
  upload_date?: string;
  raw_text?: string;
  entities?: ExtractedEntities;
}

const ENTITY_SECTIONS: {
  key: keyof EntitiesMap | string;
  label: string;
  description: string;
}[] = [
  {
    key: "PERSON",
    label: "Personnes",
    description: "Profils identifiés dans le CV",
  },
  {
    key: "CONTACT",
    label: "Contacts",
    description: "Coordonnées utiles pour joindre le candidat",
  },
  {
    key: "ORGANIZATION",
    label: "Organisations",
    description: "Entreprises, écoles ou organismes mentionnés",
  },
  { key: "LOCATION", label: "Lieux", description: "Villes ou pays associés" },
  {
    key: "EXPERIENCE",
    label: "Expériences",
    description: "Postes ou responsabilités exercés",
  },
  {
    key: "PROJECTS",
    label: "Projets / Réalisations",
    description: "Produits ou réalisations notables",
  },
  {
    key: "SKILLS",
    label: "Compétences",
    description: "Compétences comportementales ou fonctionnelles",
  },
  {
    key: "TECHNOLOGIES",
    label: "Technologies",
    description: "Stack technique, outils et frameworks utilisés",
  },
  {
    key: "EDUCATION",
    label: "Formations",
    description: "Diplômes, certifications et parcours académiques",
  },
  { key: "DATE", label: "Dates", description: "Périodes et jalons temporels" },
  {
    key: "OTHER",
    label: "Autres mentions",
    description:
      "Informations diverses ne rentrant pas dans les sections ci-dessus",
  },
];

const SECTION_META = ENTITY_SECTIONS.reduce<
  Record<string, { label: string; description: string; order: number }>
>((acc, section, index) => {
  acc[String(section.key).toLowerCase()] = {
    label: section.label,
    description: section.description,
    order: index,
  };
  return acc;
}, {});

const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const normalizeEntitiesMap = (data: unknown): EntitiesMap => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return Object.entries(data as Record<string, unknown>).reduce(
    (acc, [key, value]) => {
      const values = Array.isArray(value)
        ? value
            .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
            .filter((entry) => entry.length > 0)
        : [];

      acc[key] = values;
      return acc;
    },
    {} as EntitiesMap
  );
};

const isStructuredEntitiesPayload = (
  entities: ExtractedEntities
): entities is StructuredEntitiesPayload =>
  typeof entities === "object" &&
  entities !== null &&
  !Array.isArray(entities) &&
  ("raw" in entities || "structured" in entities);

const extractRawEntities = (entities?: ExtractedEntities): EntitiesMap => {
  if (!entities) return {};
  if (isStructuredEntitiesPayload(entities)) {
    return normalizeEntitiesMap(entities.raw ?? {});
  }
  return normalizeEntitiesMap(entities);
};

const normalizeExperienceBlocks = (
  blocks: unknown
): StructuredExperienceBlock[] => {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return null;
      const normalized: StructuredExperienceBlock = {
        title: toText((block as Record<string, unknown>).title),
        company: toText((block as Record<string, unknown>).company),
        date: toText((block as Record<string, unknown>).date),
        location: toText((block as Record<string, unknown>).location),
      };
      return Object.values(normalized).some(Boolean) ? normalized : null;
    })
    .filter((block): block is StructuredExperienceBlock => block !== null);
};

const normalizeEducationBlocks = (
  blocks: unknown
): StructuredEducationBlock[] => {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return null;
      const normalized: StructuredEducationBlock = {
        degree: toText((block as Record<string, unknown>).degree),
        school: toText((block as Record<string, unknown>).school),
        date: toText((block as Record<string, unknown>).date),
        location: toText((block as Record<string, unknown>).location),
      };
      return Object.values(normalized).some(Boolean) ? normalized : null;
    })
    .filter((block): block is StructuredEducationBlock => block !== null);
};

const extractStructuredBlocks = (entities?: ExtractedEntities) => {
  if (!entities || !isStructuredEntitiesPayload(entities)) {
    return {
      EXPERIENCE_BLOCKS: [],
      EDUCATION_BLOCKS: [],
    };
  }

  const structured = entities.structured ?? {};
  return {
    EXPERIENCE_BLOCKS: normalizeExperienceBlocks(structured.EXPERIENCE_BLOCKS),
    EDUCATION_BLOCKS: normalizeEducationBlocks(structured.EDUCATION_BLOCKS),
  };
};

export default function ExtractionsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvDetails, setCvDetails] = useState<CvDetails | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const uploaded = await uploadCV(selectedFile);
      setSuccess(
        `CV "${uploaded.filename}" téléchargé avec succès. Extraction en cours...`
      );

      const details = await getCvDetails(uploaded.cv_id);
      setCvDetails(details);
      setSuccess("Extraction des entités terminée ✅");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Échec du téléchargement du CV. Veuillez réessayer.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const entityRows = cvDetails
    ? Object.entries(extractRawEntities(cvDetails.entities))
        .map(([rawKey, entries]) => {
          const normalizedKey = String(rawKey).toLowerCase();
          const metadata = SECTION_META[normalizedKey] ?? {
            label: rawKey,
            description: "Informations détectées dans le CV",
            order: ENTITY_SECTIONS.length,
          };

          const values = Array.from(
            new Set(
              (Array.isArray(entries) ? entries : [])
                .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
                .filter((entry) => entry.length > 0)
            )
          );

          if (!values.length) return null;

          return {
            key: normalizedKey,
            label: metadata.label,
            description: metadata.description,
            order: metadata.order,
            values,
          };
        })
        .filter(
          (
            section
          ): section is {
            key: string;
            label: string;
            description: string;
            order: number;
            values: string[];
          } => Boolean(section)
        )
        .sort((a, b) => {
          if (a.order === b.order) {
            return a.label.localeCompare(b.label);
          }
          return a.order - b.order;
        })
    : [];

  const hasEntities = entityRows.length > 0;
  const totalEntityValues = entityRows.reduce(
    (total, section) => total + section.values.length,
    0
  );
  const structuredBlocks = useMemo(
    () => extractStructuredBlocks(cvDetails?.entities),
    [cvDetails]
  );
  const hasStructuredBlocks =
    structuredBlocks.EXPERIENCE_BLOCKS.length > 0 ||
    structuredBlocks.EDUCATION_BLOCKS.length > 0;
  const hasAnyDetection = hasEntities || hasStructuredBlocks;

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-3xl shadow p-8 border border-gray-100">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#1C96AD] mb-3">
          <FaInfoCircle /> Extraction d&apos;entités
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Analyse de CV automatisée
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Téléchargez un CV (PDF ou DOCX). Nous extrayons automatiquement les
          entités clés (compétences, expériences, contacts...) pour alimenter
          vos analyses ou matcher des offres.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-3xl shadow border border-gray-100 p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              1. Télécharger un CV
            </h2>
            <p className="text-gray-600">
              Formats acceptés : PDF ou DOCX. Taille max : 10&nbsp;Mo.
            </p>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#1C96AD] rounded-2xl bg-[#1C96AD]/5 cursor-pointer hover:bg-[#1C96AD]/10 transition-colors">
            <div className="flex flex-col items-center gap-3 text-[#1C96AD]">
              <FaUpload className="text-3xl" />
              <div className="text-center text-gray-700">
                <p className="font-semibold">
                  {selectedFile
                    ? selectedFile.name
                    : "Cliquez ou glissez-déposez votre CV"}
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOCX | max 10&nbsp;Mo
                </p>
              </div>
            </div>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-semibold transition-all bg-gradient-to-r from-[#1C96AD] to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {uploading ? "Extraction en cours..." : "Lancer l'extraction"}
          </button>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-sm">
              <FaCheckCircle />
              <span>{success}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow border border-gray-100 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            2. Résultat de l&apos;extraction
          </h2>
          {cvDetails ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">Fichier :</span>{" "}
                  {cvDetails.filename}
                </div>
                {cvDetails.upload_date && (
                  <div>
                    <span className="font-semibold text-gray-900">Date :</span>{" "}
                    {new Date(cvDetails.upload_date).toLocaleString("fr-FR")}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl max-h-72 overflow-y-auto text-sm text-gray-600 whitespace-pre-line">
                {cvDetails.raw_text
                  ? cvDetails.raw_text.slice(0, 3000) +
                    (cvDetails.raw_text.length > 3000 ? "..." : "")
                  : "Aucun aperçu disponible."}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-12">
              Aucun CV analysé pour le moment. Téléchargez un document pour voir
              les résultats.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow border border-gray-100 p-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            3. Entités détectées
          </h2>
          {cvDetails && (
            <span className="text-sm text-gray-500">
              CV analysé : {cvDetails.filename}
            </span>
          )}
        </div>

        {!cvDetails && (
          <div className="text-center py-12 text-gray-500">
            Téléchargez un CV pour lancer l&apos;extraction.
          </div>
        )}

        {cvDetails && (
          <>
            {!hasAnyDetection && (
              <div className="mt-8 text-center py-8 text-gray-600 space-y-2 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <p className="text-base font-semibold text-gray-900">
                  Entités détectées
                </p>
                <p className="text-sm text-gray-500">
                  CV analysé : {cvDetails.filename}
                </p>
                <p className="text-sm text-gray-500">
                  Aucune entité n&apos;a été détectée ou les données sont vides.
                </p>
              </div>
            )}

            {hasEntities && (
              <div className="mt-8 space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Sections remplies
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {entityRows.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Entités totales
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {totalEntityValues}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Dernière mise à jour
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {new Date().toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {entityRows.map(({ key, label, description, values }) => (
                    <div
                      key={key}
                      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div>
                          <p className="text-sm uppercase tracking-wide text-[#1C96AD]">
                            Section
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {label}
                          </h3>
                          <p className="text-sm text-gray-500">{description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Volume détecté
                          </p>
                          <span className="inline-flex items-center justify-center rounded-full bg-[#1C96AD]/10 px-4 py-1 text-sm font-semibold text-[#1C96AD]">
                            {values.length} élément
                            {values.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                        {values.map((value, index) => (
                          <div
                            key={`${key}-${value}-${index}`}
                            className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xs font-semibold text-gray-400">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">
                                  {value}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Aligné avec {label.toLowerCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasStructuredBlocks && (
              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#1C96AD]">
                    Synthèse structurée
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Blocs EXPERIENCE & EDUCATION
                  </h3>
                  <p className="text-sm text-gray-500">
                    Associations entre titres, organisations, dates et lieux
                    détectées automatiquement.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {structuredBlocks.EXPERIENCE_BLOCKS.length > 0 && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Blocs structurés
                          </p>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Expériences
                          </h4>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-full bg-[#1C96AD]/10 px-4 py-1 text-sm font-semibold text-[#1C96AD]">
                          {structuredBlocks.EXPERIENCE_BLOCKS.length} bloc
                          {structuredBlocks.EXPERIENCE_BLOCKS.length > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      <div className="mt-4 space-y-4">
                        {structuredBlocks.EXPERIENCE_BLOCKS.map(
                          (block, index) => {
                            const fields = [
                              { label: "Titre", value: block.title },
                              { label: "Entreprise", value: block.company },
                              { label: "Période", value: block.date },
                              { label: "Lieu", value: block.location },
                            ].filter((field) => field.value);

                            return (
                              <div
                                key={`exp-block-${index}`}
                                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                              >
                                <p className="text-xs font-semibold text-gray-400">
                                  Bloc {String(index + 1).padStart(2, "0")}
                                </p>
                                {fields.length > 0 ? (
                                  <dl className="mt-3 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                                    {fields.map((field) => (
                                      <div key={field.label}>
                                        <dt className="text-xs uppercase tracking-wide text-gray-400">
                                          {field.label}
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
                                          {field.value}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                ) : (
                                  <p className="mt-3 text-sm text-gray-500">
                                    Informations insuffisantes pour ce bloc.
                                  </p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {structuredBlocks.EDUCATION_BLOCKS.length > 0 && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Blocs structurés
                          </p>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Formations
                          </h4>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-full bg-[#1C96AD]/10 px-4 py-1 text-sm font-semibold text-[#1C96AD]">
                          {structuredBlocks.EDUCATION_BLOCKS.length} bloc
                          {structuredBlocks.EDUCATION_BLOCKS.length > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      <div className="mt-4 space-y-4">
                        {structuredBlocks.EDUCATION_BLOCKS.map(
                          (block, index) => {
                            const fields = [
                              { label: "Diplôme", value: block.degree },
                              { label: "Établissement", value: block.school },
                              { label: "Période", value: block.date },
                              { label: "Lieu", value: block.location },
                            ].filter((field) => field.value);

                            return (
                              <div
                                key={`edu-block-${index}`}
                                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                              >
                                <p className="text-xs font-semibold text-gray-400">
                                  Bloc {String(index + 1).padStart(2, "0")}
                                </p>
                                {fields.length > 0 ? (
                                  <dl className="mt-3 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                                    {fields.map((field) => (
                                      <div key={field.label}>
                                        <dt className="text-xs uppercase tracking-wide text-gray-400">
                                          {field.label}
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
                                          {field.value}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                ) : (
                                  <p className="mt-3 text-sm text-gray-500">
                                    Informations insuffisantes pour ce bloc.
                                  </p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
