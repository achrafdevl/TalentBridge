import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export const uploadCV = async (file: File) => {
  const token = Cookies.get("tb_token");
  if (!token) {
    throw new Error(
      "Authentication required. Please log in to upload your CV."
    );
  }

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/cv/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    let errorMessage = `Upload failed (${res.status})`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      const txt = await res.text();
      if (txt) errorMessage = txt;
    }

    if (res.status === 401) {
      errorMessage = `${errorMessage} Please log in again.`;
    }

    throw new Error(errorMessage);
  }

  return res.json();
};

export const createCVFromProfile = async (): Promise<{
  cv_id: string;
  filename: string;
}> => {
  // Get auth token from cookie (kept in sync with auth slice)
  const token = Cookies.get("tb_token");

  if (!token) {
    throw new Error(
      "Authentication required. Please log in to create a CV from your profile."
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_BASE}/cv/from-profile`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    let errorMessage = `Authentication failed (${res.status})`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      const txt = await res.text();
      if (txt) {
        try {
          const parsed = JSON.parse(txt);
          errorMessage = parsed.detail || parsed.message || errorMessage;
        } catch {
          errorMessage = txt || errorMessage;
        }
      }
    }

    if (res.status === 401) {
      // Token expired or invalid - suggest re-login
      errorMessage = `${errorMessage} Please log in again.`;
    }

    throw new Error(errorMessage);
  }

  return res.json();
};

export const uploadJob = async (params: {
  title?: string;
  file?: File;
  text?: string;
}) => {
  const fd = new FormData();
  if (params.title) fd.append("title", params.title);
  if (params.file) fd.append("file", params.file);
  if (params.text) fd.append("text", params.text);
  const res = await fetch(`${API_BASE}/job/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`uploadJob failed ${res.status}`);
  return res.json();
};

export const generateCV = async (cvId: string, jobId: string) => {
  const fd = new FormData();
  fd.append("cv_id", cvId);
  fd.append("job_id", jobId);
  const res = await fetch(`${API_BASE}/generate/`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`generateCV failed ${res.status} ${txt}`);
  }
  return res.json();
};

export const getSimilarityScore = async (cvId: string, jobId: string) => {
  // Backend returns: { similarity_score: float } in similarity/test
  const res = await fetch(
    `${API_BASE}/similarity/test?cv_id=${cvId}&job_id=${jobId}`
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`getSimilarityScore failed ${res.status} ${txt}`);
  }
  return res.json();
};

export const getAnalysis = async (cvId: string, jobId: string) => {
  // analysis route: returns similarity + keywords if implemented
  const res = await fetch(`${API_BASE}/analysis/cv-job/${cvId}/${jobId}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`getAnalysis failed ${res.status} ${txt}`);
  }
  return res.json();
};

export const downloadGenerated = async (generatedId: string) => {
  const res = await fetch(`${API_BASE}/generate/download/${generatedId}`);
  if (!res.ok) throw new Error(`downloadGenerated failed ${res.status}`);
  return res.blob();
};
