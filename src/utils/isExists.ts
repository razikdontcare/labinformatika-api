import { db } from "../lib/firebase.js";

export default async function isExists(id: string): Promise<boolean> {
  if (id === "") return true;
  const doc = await db.collection("projects").doc(id).get();
  return doc.exists;
}
