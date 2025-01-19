import { Hono } from "hono";
import { createUser, loginWithUsername, AuthError } from "../lib/auth.js";

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
    if (error instanceof AuthError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to login" }, 500);
  }
});

auth.post("/register", async (c) => {
  try {
    const { username, password, email, role } = await c.req.json();
    const user = await createUser({ username, email, password, role });
    return c.json({ user }, 201);
  } catch (error) {
    if (error instanceof AuthError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to register" }, 500);
  }
});

export default auth;
