import { serve } from "@hono/node-server";
import { Hono } from "hono";
import pr from "./routes/projects.js";
import auth from "./routes/auth.js";
import "dotenv/config";
import { verifyIdToken } from "./lib/auth.js";
import type { Variables } from "./type.js";

const app = new Hono<{ Variables: Variables }>();

const PUBLIC_PATH = ["/", "/auth/login", "/project/list", "/project/get"];

app.use(async (c, next) => {
  const authorization = c.req.header("Authorization")?.split(" ")[1];

  if (!PUBLIC_PATH.includes(c.req.path)) {
    if (!authorization) {
      return c.json({ error: "Unauthorized: No token provided" }, 401);
    }
    try {
      const decodedToken = await verifyIdToken(authorization);
      c.set("user", decodedToken);
    } catch (error) {
      console.error("Error verifying token:", error);
      return c.json({ error: "Unauthorized: Invalid token" }, 401);
    }
  }
  await next();
});

app.use(async (c, next) => {
  const { method, path } = c.req;
  const day = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  console.log(`[${day} ${time}] ${method} ${path}`);
  await next();
});

app.get("/", (c) => {
  return c.json({ msg: "Lab Informatika Official API", version: "1.1.0" });
});

app.route("/project", pr);
app.route("/auth", auth);

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default serve({
  fetch: app.fetch,
  port: 8000,
});
