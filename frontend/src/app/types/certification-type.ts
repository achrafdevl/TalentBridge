export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  type: "certificat" | "diplôme";
  credentialId?: string;
  credentialUrl?: string;
  }