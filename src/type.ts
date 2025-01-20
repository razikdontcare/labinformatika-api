import type { DecodedIdToken } from "firebase-admin/auth";

export interface Creator {
  name: string;
  nim: string;
}

export interface ProjectData {
  name: string;
  description: string;
  picture: string;
  creators: Creator[];
  projectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends ProjectData {
  id: string;
}

export type Variables = {
  user: DecodedIdToken;
};
