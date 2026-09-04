"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handleLogout = async () => {
  try {
    // Sign out from Firebase client
    await signOut(auth);

    // Clear the server session cookie
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    window.location.href = "/admin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const Logout = () => {
  return (
    <button
      className="transition-colors duration-300 ease-out hover:bg-[#444444] px-3 py-2 rounded-2xl cursor-pointer"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
