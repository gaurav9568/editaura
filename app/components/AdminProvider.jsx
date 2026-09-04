"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export default function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
        document.body.classList.add("admin-mode");
      } else {
        setIsAdmin(false);
        document.body.classList.remove("admin-mode");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setIsAdmin(false);
      document.body.classList.remove("admin-mode");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{ isAdmin, loading, login: null, logout, showLoginModal, setShowLoginModal }}
    >
      {children}
    </AdminContext.Provider>
  );
}
