"use client";
import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginModal() {
  const { showLoginModal, setShowLoginModal } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleLogin = async () => {
    setLoading(true);
    setError(false);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get ID token and create session cookie
      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
        headers: { "Content-Type": "application/json" },
      });

      setShowLoginModal(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(true);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
    if (e.key === "Escape") {
      setShowLoginModal(false);
      setError(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        background: "rgba(6,6,8,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowLoginModal(false);
          setError(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          background: "var(--black3)",
          border: "1px solid rgba(200,164,90,0.2)",
          padding: "3rem",
          width: "min(420px, 92vw)",
          borderRadius: "3px",
          position: "relative",
        }}
      >
        {/* Top gold line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(to right, transparent, var(--gold), transparent)",
          }}
        />

        <button
          onClick={() => {
            setShowLoginModal(false);
            setError(false);
          }}
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "1.1rem",
            background: "none",
            border: "none",
            color: "rgba(240,232,216,0.5)",
            fontSize: "1.1rem",
            cursor: "pointer",
            fontFamily: "var(--font-jost), 'Jost', sans-serif",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--gold)",
            marginBottom: "0.3rem",
          }}
        >
          Admin Access
        </h2>
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(240,232,216,0.5)",
            letterSpacing: "0.08em",
            marginBottom: "2rem",
          }}
        >
          EDITAURA Studio — Restricted Area
        </p>

        <div style={{ marginBottom: "1.2rem" }}>
          <label
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.45rem",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email"
            autoComplete="email"
            autoFocus
            style={{
              width: "100%",
              background: "rgba(240,232,216,0.03)",
              border: "1px solid rgba(200,164,90,0.18)",
              color: "var(--cream)",
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "0.9rem",
              padding: "0.8rem 1rem",
              borderRadius: "1px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.45rem",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
            style={{
              width: "100%",
              background: "rgba(240,232,216,0.03)",
              border: "1px solid rgba(200,164,90,0.18)",
              color: "var(--cream)",
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "0.9rem",
              padding: "0.8rem 1rem",
              borderRadius: "1px",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p
            style={{
              fontSize: "0.72rem",
              color: "#e07070",
              marginBottom: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            Incorrect email or password.
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.95rem",
            background: loading ? "rgba(200,164,90,0.5)" : "var(--gold)",
            color: "var(--black)",
            fontFamily: "var(--font-jost), 'Jost', sans-serif",
            fontSize: "0.66rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "1px",
            cursor: loading ? "wait" : "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "var(--gold2)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "var(--gold)";
          }}
        >
          {loading ? "Authenticating..." : "Enter Studio"}
        </button>
      </div>
    </div>
  );
}
