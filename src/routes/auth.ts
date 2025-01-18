import { Hono } from "hono";
import { createUser, loginWithUsername } from "../lib/auth.js";

const auth = new Hono();

auth.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const token = await loginWithUsername({
      username: username,
      password: password,
    });
    return c.json({ token }, 200);
  } catch (error) {
    console.error("Error in /login route:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

auth.post("/register", async (c) => {
  try {
    const body = await c.req.parseBody();
    const username = body["username"] as string;
    const email = body["email"] as string;
    const password = body["password"] as string;
    const uid = await createUser({ username, email, password });
    return c.json({ uid: uid }, 201);
  } catch (error) {
    console.error("Error in /register route:", error);
    return c.json({ error: "Failed to register" }, 500);
  }
});

export default auth;
