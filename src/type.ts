import type { DecodedIdToken } from "firebase-admin/auth";

export interface Creator {
  name: string;
  nim: string;
}

export type Role = "admin" | "user";

export interface ProjectData {
  name: string;
  description: string;
  picture: {
    url: string;
    id: string;
  };
  creators: Creator[];
  projectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends ProjectData {
  id: string;
}

export interface UserDetail {
  id: string;
  createdAt: Date;
  email: string;
  passwordHash: string;
  role: Role;
  username: string;
  picture: {
    url: string;
    id: string;
  };
  emailVerified: boolean;
}

export type Variables = {
  user: DecodedIdToken;
};
