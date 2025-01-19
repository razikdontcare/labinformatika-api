import { serve } from "@hono/node-server";
import { Hono } from "hono";
import pr from "./routes/projects.js";
import auth from "./routes/auth.js";
import "dotenv/config";

const app = new Hono();

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
