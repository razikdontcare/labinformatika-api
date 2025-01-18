import { serve } from "@hono/node-server";
import { Hono } from "hono";
import pr from "./routes/projects.js";
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
  return c.json({ msg: "Lab Informatika Official API", version: "1.0.0" });
});

app.route("/project", pr);

const port = parseInt(process.env.PORT ? process.env.PORT : "8000");
console.log(`- Server is running on http://localhost:${port}\n`);

serve({
  fetch: app.fetch,
  port,
});
