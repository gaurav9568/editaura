import { adminAuth } from "./firebase-admin";
import { cookies } from "next/headers";

export const verifyAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
