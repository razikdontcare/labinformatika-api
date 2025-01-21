import path from "path";
import type { Role, User, UserDetail } from "../type.js";
import generateId from "../utils/generateId.js";
import { saltPassword } from "../utils/saltPassword.js";
import { auth, db } from "./firebase.js";
import bcrypt from "bcryptjs";
import { img } from "./imagekit.js";

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

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
    throw error;
  }
};

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw error;
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
      throw new AuthError("USER_NOT_FOUND", "User not found");
    }

    const user = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    const isValid = await validatePassword(
      credentials.password,
      user.passwordHash
    );
    if (!isValid) {
      throw new AuthError("INVALID_PASSWORD", "Invalid password");
    }

    const token = await createCustomToken(userId, {
      username: credentials.username,
      role: user.role,
    });

    return { token, userId, user };
  } catch (error) {
    console.error("Error logging in with username:", error);
    throw error;
  }
};

export const createUser = async (credentials: {
  username: string;
  email: string;
  password: string;
  role?: Role;
  emailVerified?: boolean;
}) => {
  try {
    const passwordHash = await saltPassword(credentials.password);

    const userSnapshot = await db
      .collection("users")
      .where("username", "==", credentials.username)
      .get();

    const emailSnapshot = await db
      .collection("users")
      .where("email", "==", credentials.email)
      .get();

    if (!userSnapshot.empty) {
      throw new AuthError(
        "USER_EXISTS",
        "Account with that username already exists"
      );
    }

    if (!emailSnapshot.empty) {
      throw new AuthError(
        "EMAIL_EXISTS",
        "Account with that email already exists"
      );
    }

    const userId = generateId("IFUSER");

    const user: User = {
      id: userId,
      username: credentials.username,
      email: credentials.email,
      passwordHash,
      createdAt: new Date(),
      role: credentials.role || "user",
      emailVerified: credentials.emailVerified || false,
      picture: {
        url: "",
        id: "",
      },
    };

    const userRef = await db.collection("users").doc(userId).set(user);
    return { ...user, ref: userRef };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const listUsers = async (): Promise<UserDetail[]> => {
  try {
    const snapshot = await db.collection("users").get();
    if (snapshot.empty) return [] as UserDetail[];
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
};

export async function uploadProfileImage(file: File, filename?: string) {
  try {
    const buffer = await file.arrayBuffer();
    const folder = "labinformatika/users";
    const fileExtension =
      filename && path.extname(filename) !== ""
        ? path.extname(filename)
        : path.extname(file.name);
    const res = await img.upload({
      file: Buffer.from(buffer),
      fileName: filename
        ? path.basename(filename, fileExtension) + fileExtension
        : file.name,
      useUniqueFileName: false,
      folder,
    });
    return res;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function updateUser(data: Partial<User>) {
  try {
    if (!data.id) {
      throw new AuthError("MISSING_ID", "Missing user ID");
    }
    const userRef = db.collection("users").doc(data.id);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      throw new AuthError("USER_NOT_FOUND", "User not found");
    }
    await userRef.update(data);
    return (await userRef.get()).data() as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
