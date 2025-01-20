import { db } from "./firebase.js";
import { img } from "./imagekit.js";
import type { Project } from "../type.js";
import path from "path";

export async function uploadImage(file: File, filename?: string) {
  try {
    const buffer = await file.arrayBuffer();
    const folder = "labinformatika";
    const fileExtension =
      filename && path.extname(filename) !== ""
        ? path.extname(filename)
        : path.extname(file.name);
    const res = await img.upload({
      file: Buffer.from(buffer),
      fileName: filename
        ? path.basename(filename, fileExtension) + fileExtension
        : file.name,
      useUniqueFileName: false,
      folder,
    });
    return res;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImage(id: string) {
  try {
    await img.deleteFile(id);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export async function addProject(data: Project) {
  try {
    await db.collection("projects").doc(data.id).set(data);
    return data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw new Error("Failed to add project");
  }
}

export async function getProject(id: string) {
  try {
    const doc = await db.collection("projects").doc(id).get();
    return doc.data() as Project;
  } catch (error) {
    console.error("Error getting project:", error);
    throw new Error("Failed to get project");
  }
}

export async function listProjects() {
  try {
    const snapshot = await db.collection("projects").get();
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error listing projects:", error);
    throw new Error("Failed to list projects");
  }
}
