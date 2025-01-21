import type { DecodedIdToken } from "firebase-admin/auth";

export interface Creator {
  name: string;
  nim: string;
}

export type LabCollection = "projects" | "users";
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

export interface User extends UserDetail {
  id: string;
}

export type Variables = {
  user: DecodedIdToken;
};
