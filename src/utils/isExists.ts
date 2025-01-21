import { db } from "../lib/firebase.js";
import type { LabCollection } from "../type.js";

export default async function isExists(
  id: string,
  collection: LabCollection = "projects"
): Promise<boolean> {
  if (id === "") return true;
  const doc = await db.collection(collection).doc(id).get();
  return doc.exists;
}
