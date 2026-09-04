import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isLoggedIn = false;

  if (token) {
    try {
      await adminAuth.verifyIdToken(token);
      isLoggedIn = true;
    } catch {
      console.log("Invalid or expired token");
    }
  }

  return <>{isLoggedIn ? <Dashboard /> : <Login />}</>;
}