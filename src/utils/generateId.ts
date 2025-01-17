import { customAlphabet } from "nanoid";

const generateId = (): string => {
  const prefix = "IFLAB";
  const length = 11;
  const year = new Date().getFullYear();
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", length);
  return prefix + year + nanoid();
};

export default generateId;
