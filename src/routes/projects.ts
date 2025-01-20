import { Hono } from "hono";
import {
  addProject,
  getProject,
  listProjects,
  uploadImage,
} from "../lib/manage.js";
import type { Project, ProjectData, Variables } from "../type.js";
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
    return c.json({ url: res.url, path: res.filePath }, 200);
  } catch (error) {
    console.error("Error in /upload-image route:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

pr.post("/add", async (c) => {
  try {
    const user = c.get("user");
    if (user.role !== "admin") return c.json({ error: "Unauthorized" }, 401);
    const body = (await c.req.json()) as ProjectData;
    let id = generateId();
    while (await isExists(id)) id = generateId();
    const data: Project = {
      id,
      ...body,
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
    await db.collection("projects").doc(id).delete();
    return c.json({ message: "Project deleted" }, 200);
  } catch (error) {
    console.error("Error in /delete route:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

export default pr;
