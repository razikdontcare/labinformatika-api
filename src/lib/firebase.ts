import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";

const app = initializeApp({
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env
      .FIREBASE_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});

export const db = getFirestore(app);
