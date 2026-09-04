"use client";
import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import AdminLoginModal from "./AdminLoginModal";

const navLinks = [
  { title: "Work", url: "#portfolio" },
  { title: "Studio", url: "#home" },
  { title: "Services", url: "#services" },
  { title: "Reviews", url: "#testimonials" },
];

export default function Navbar() {
  const { isAdmin, logout, setShowLoginModal } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 5rem",
          background:
            "linear-gradient(180deg, rgba(6,6,8,0.97) 0%, transparent 100%)",
        }}
      >
        <Link
          href="#portfolio"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "1.55rem",
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold)",
            textDecoration: "none",
          }}
        >
          EDITAURA
        </Link>

        {/* Desktop Links */}
        <ul
          className="nav-links-desktop"
          style={{
            display: "flex",
            gap: "2.8rem",
            listStyle: "none",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <li key={link.title}>
              <NavLink href={link.url}>{link.title}</NavLink>
            </li>
          ))}
          <li>
            <Link
              href="#inquiry"
              className="nav-cta-link"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                background: "transparent",
                border: "1px solid var(--gold3)",
                color: "var(--gold)",
                padding: "0.58rem 1.5rem",
                borderRadius: "1px",
                textDecoration: "none",
                transition: "background 0.3s, border-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--goldglow)";
                e.target.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "var(--gold3)";
              }}
            >
              Inquire
            </Link>
          </li>
          <li>
            {!isAdmin ? (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "rgba(200,164,90,0.08)",
                  border: "1px solid rgba(200,164,90,0.25)",
                  color: "rgba(200,164,90,0.6)",
                  padding: "0.45rem 1rem",
                  borderRadius: "1px",
                  cursor: "pointer",
                  fontFamily: "var(--font-jost), 'Jost', sans-serif",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(200,164,90,0.15)";
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.color = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(200,164,90,0.08)";
                  e.currentTarget.style.borderColor = "rgba(200,164,90,0.25)";
                  e.currentTarget.style.color = "rgba(200,164,90,0.6)";
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Admin
              </button>
            ) : (
              <button
                onClick={logout}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "rgba(200,164,90,0.12)",
                  border: "1px solid rgba(200,164,90,0.3)",
                  color: "var(--gold)",
                  padding: "0.45rem 1rem",
                  borderRadius: "1px",
                  cursor: "pointer",
                  fontFamily: "var(--font-jost), 'Jost', sans-serif",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(200,164,90,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(200,164,90,0.12)";
                }}
              >
                Logout
              </button>
            )}
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "1px solid rgba(200,164,90,0.3)",
            color: "var(--gold)",
            padding: "0.5rem",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          className="mobile-menu-dropdown"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 199,
            background: "rgba(6,6,8,0.98)",
            borderBottom: "1px solid rgba(200,164,90,0.15)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--cream2)",
                textDecoration: "none",
              }}
            >
              {link.title}
            </Link>
          ))}
          <Link
            href="#inquiry"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: "transparent",
              border: "1px solid var(--gold3)",
              color: "var(--gold)",
              padding: "0.58rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Inquire
          </Link>
        </div>
      )}

      <AdminLoginModal />

    </>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: "0.67rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "rgba(240,232,216,0.5)",
        textDecoration: "none",
        position: "relative",
        paddingBottom: "4px",
        transition: "color 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--gold)";
        const line = e.currentTarget.querySelector("span");
        if (line) line.style.width = "100%";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(240,232,216,0.5)";
        const line = e.currentTarget.querySelector("span");
        if (line) line.style.width = "0";
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 0,
          height: "1px",
          background: "var(--gold)",
          transition: "width 0.35s",
        }}
      />
    </Link>
  );
}
