import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.use(async (c, next) => {
  const { method, url } = c.req;
  const day = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  console.log(`[${day} ${time}] ${method} ${url}`);
  await next();
});

app.get("/", (c) => {
  return c.json({ msg: "Lab Informatika Official API", version: "1.0.0" });
});

const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
