import { saltPassword } from "../utils/saltPassword.js";
import { auth, db } from "./firebase.js";
import bcrypt from "bcryptjs";

export const validatePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createCustomToken = async (
  uid: string,
  additionalClaims: object = {}
): Promise<string> => {
  try {
    const token = auth.createCustomToken(uid, additionalClaims);
    return token;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw new Error("Failed to create custom token");
  }
};

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Failed to verify ID token");
  }
};

export const loginWithUsername = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", credentials.username)
      .get();

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const user = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    const isValid = await validatePassword(
      credentials.password,
      user.passwordHash
    );
    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = await createCustomToken(userId, {
      username: credentials.username,
    });

    return { token, userId, user };
  } catch (error) {
    console.error("Error logging in with username:", error);
    throw new Error("Failed to login with username");
  }
};

export const createUser = async (credentials: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) => {
  try {
    const passwordHash = await saltPassword(credentials.password);

    const user = {
      username: credentials.username,
      email: credentials.email,
      passwordHash,
      createdAt: new Date(),
      role: credentials.role || "user",
    };

    const userRef = await db.collection("users").add(user);
    return userRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
