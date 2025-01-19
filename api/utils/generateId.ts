import { customAlphabet } from "nanoid";

const generateId = (prefix?: string): string => {
  const pre = prefix ?? "IFLAB";
  const length = 11;
  const year = new Date().getFullYear();
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", length);
  return pre + year + nanoid();
};

export default generateId;
