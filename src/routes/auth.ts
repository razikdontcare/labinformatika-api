import { Hono } from "hono";
import {
  createUser,
  loginWithUsername,
  AuthError,
  listUsers,
  uploadProfileImage,
  updateUser,
} from "../lib/auth.js";
import type { User, Variables } from "../type.js";
import generateId from "../utils/generateId.js";
import isExists from "../utils/isExists.js";
import { db } from "../lib/firebase.js";

const auth = new Hono<{ Variables: Variables }>();

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
        emailVerified: result.user.emailVerified,
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
    const { username, password, email, role, emailVerified } =
      await c.req.json();
    const user = await createUser({
      username,
      email,
      password,
      role,
      emailVerified,
    });
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

auth.get("/users", async (c) => {
  try {
    const user = c.get("user");
    if (user.role !== "admin") return c.json({ error: "Unauthorized" }, 401);
    const users = await listUsers();
    return c.json(users, 200);
  } catch (error) {
    return c.json({ error: "Failed to list users" }, 500);
  }
});

auth.get("/generate-id", async (c) => {
  let id = generateId("IFUSER");
  while (await isExists(id, "users")) id = generateId("IFUSER");
  return c.json({ id }, 200);
});

auth.post("/upload-image", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as File;
    const filename = body["filename"] as string | undefined;
    if (!file) return c.json({ error: "No file found" }, 400);

    const res = await uploadProfileImage(file, filename);
    return c.json({ url: res.url, fileId: res.fileId }, 200);
  } catch (error) {
    console.error("Error in /upload-image route:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

auth.put("/update", async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const body = (await c.req.json()) as Partial<User>;
    if (body.id !== user.id && user.role !== "admin")
      return c.json({ error: "Unauthorized" }, 401);
    const updatedUser = await updateUser(body);
    return c.json(updatedUser, 200);
  } catch (error) {
    return c.json({ error: "Failed to update user" }, 500);
  }
});

auth.post("/check-username", async (c) => {
  try {
    const { username } = (await c.req.json()) as { username: string };
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    const usernameExists = !userSnapshot.empty;

    return c.json({ exists: usernameExists }, 200);
  } catch (error) {
    return c.json({ error: "Failed to check username" }, 500);
  }
});

auth.post("/check-email", async (c) => {
  try {
    const { email } = (await c.req.json()) as { email: string };
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    const emailExists = !userSnapshot.empty;

    return c.json({ exists: emailExists }, 200);
  } catch (error) {
    return c.json({ error: "Failed to check email" }, 500);
  }
});

export default auth;
