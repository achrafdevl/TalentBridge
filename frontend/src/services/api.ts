   // services/api.ts
   export const uploadCV = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/cv/upload", { method: "POST", body: formData });
    return res.json();
  };

  export const uploadJob = async (params: { title?: string; file?: File; text?: string }) => {
    const formData = new FormData();
    if (params.title) formData.append("title", params.title);
    if (params.file) formData.append("file", params.file);
    if (params.text) formData.append("text", params.text);
    const res = await fetch("http://localhost:8000/job/upload", { method: "POST", body: formData });
    return res.json();
  };

  export const generateCV = async (cvId: string, jobId: string) => {
    const formData = new FormData();
    formData.append("cv_id", cvId);
    formData.append("job_id", jobId);
    const res = await fetch("http://localhost:8000/generate/", { method: "POST", body: formData });
    return res.json();
  };
  