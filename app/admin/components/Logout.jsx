"use client";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Logout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase text-red-300/80 hover:text-red-200 hover:bg-red-900/20 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer font-sans"
        title="Sign Out"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Logout</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0e0e14] border border-[#c8a45a]/30 rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-lg font-serif text-[#c8a45a] tracking-wide mb-2" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
              Sign Out of Studio?
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              You will need to sign in again to edit videos, packages, or FAQs.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loggingOut}
                className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-5 py-2 rounded-lg text-xs uppercase tracking-wider bg-red-600/80 hover:bg-red-600 text-white font-medium transition-colors cursor-pointer"
              >
                {loggingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
