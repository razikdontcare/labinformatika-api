import { Hono } from "hono";
import { createUser, loginWithUsername } from "../lib/auth.js";

const auth = new Hono();

auth.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const result = await loginWithUsername({
      username: username,
      password: password,
    });

    return c.json(
      {
        token: result.token,
        email: result.user.email,
      },
      200
    );
  } catch (error) {
    console.error("Error in /login route:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

auth.post("/register", async (c) => {
  try {
    const { username, password, email, role } = await c.req.json();
    const user = await createUser({ username, email, password, role });
    return c.json({ user }, 201);
  } catch (error) {
    console.error("Error in /register route:", error);
    return c.json({ error: "Failed to register" }, 500);
  }
});

export default auth;
