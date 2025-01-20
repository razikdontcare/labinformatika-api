import { Hono } from "hono";
import {
  addProject,
  deleteImage,
  getProject,
  listProjects,
  uploadImage,
} from "../lib/manage.js";
import type { Project, Variables } from "../type.js";
import generateId from "../utils/generateId.js";
import isExists from "../utils/isExists.js";
import { db } from "../lib/firebase.js";

const pr = new Hono<{ Variables: Variables }>();

pr.post("/upload-image", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as File;
    const filename = body["filename"] as string | undefined;
    if (!file) return c.json({ error: "No file found" }, 400);

    const res = await uploadImage(file, filename);
    return c.json({ url: res.url, fileId: res.fileId }, 200);
  } catch (error) {
    console.error("Error in /upload-image route:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

pr.get("/generate-id", async (c) => {
  let id = generateId();
  while (await isExists(id)) id = generateId();
  return c.json({ id }, 200);
});

pr.post("/add", async (c) => {
  try {
    const user = c.get("user");
    if (user.role !== "admin") return c.json({ error: "Unauthorized" }, 401);
    const body = (await c.req.json()) as Project;
    let id = body.id == "" ? generateId() : body.id;
    const data: Project = {
      ...body,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await addProject(data);
    return c.json(res, 201);
  } catch (error) {
    console.error("Error in /add route:", error);
    return c.json({ error: "Failed to add project" }, 500);
  }
});

pr.get("/get/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await getProject(id);
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in /get route:", error);
    return c.json({ error: "Failed to get project" }, 500);
  }
});

pr.get("/list", async (c) => {
  try {
    const data = await listProjects();
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in /list route:", error);
    return c.json({ error: "Failed to list projects" }, 500);
  }
});

pr.delete("/delete/:id", async (c) => {
  try {
    const user = c.get("user");
    if (user.role !== "admin") return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param("id");
    const projectRef = db.collection("projects").doc(id);
    const fileId = (await projectRef.get()).data()?.picture.id;
    await projectRef.delete();
    await deleteImage(fileId);
    return c.json({ message: "Project deleted" }, 200);
  } catch (error) {
    console.error("Error in /delete route:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

pr.put("/update/:id", async (c) => {
  try {
    const user = c.get("user");
    if (user.role !== "admin") return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param("id");
    const body = (await c.req.json()) as Partial<Project>;
    const data = {
      ...body,
      updatedAt: new Date(),
    };
    const res = await db.collection("projects").doc(id).update(data);
    return c.json(res, 200);
  } catch (error) {
    console.error("Error in /update route:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

export default pr;
