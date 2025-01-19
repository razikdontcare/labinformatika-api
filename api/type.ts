export interface ProjectData {
  name: string;
  description: string;
  picture: string;
  creators: string[];
  projectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends ProjectData {
  id: string;
}
