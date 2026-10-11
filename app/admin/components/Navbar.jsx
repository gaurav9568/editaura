"use client";
import Link from "next/link";
import Logout from "./Logout";

const links = [
  { id: "work", title: "Videos & Portfolio", icon: "🎬" },
  { id: "packages", title: "Packages & Pricing", icon: "💎" },
  { id: "faq", title: "FAQs", icon: "💬" },
];

export default function Navbar({ page, setPage, counts = {} }) {
  return (
    <header className="sticky top-0 z-50 bg-[#060608]/95 backdrop-blur-xl border-b border-[#c8a45a]/25 shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white no-underline group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#c8a45a]/15 border border-[#c8a45a]/60 flex items-center justify-center text-[#c8a45a] font-serif font-bold text-base shadow-[0_0_15px_rgba(200,164,90,0.3)] group-hover:bg-[#c8a45a]/30 transition-all">
              E
            </div>
            <div className="flex flex-col">
              <span
                className="text-lg tracking-[0.2em] font-serif font-medium text-white leading-none group-hover:text-[#c8a45a] transition-colors"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                }}
              >
                EDITAURA
              </span>
              <span className="text-[0.55rem] tracking-[0.3em] uppercase text-[#c8a45a] font-mono mt-0.5">
                Studio Admin Vault
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-[#121218] p-1.5 rounded-full border border-[#c8a45a]/30 shadow-inner">
          {links.map((link) => {
            const isActive = page === link.id;
            const count = counts[link.id];

            return (
              <button
                key={link.id}
                onClick={() => setPage(link.id)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black font-bold shadow-[0_0_20px_rgba(200,164,90,0.5)] scale-102"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                <span className="hidden sm:inline">{link.title}</span>
                {typeof count === "number" && (
                  <span
                    className={`text-[0.65rem] px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? "bg-black/40 text-black font-extrabold"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions: View Website & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase text-gray-300 hover:text-[#c8a45a] bg-white/5 hover:bg-[#c8a45a]/10 border border-gray-700 hover:border-[#c8a45a]/50 transition-all font-sans"
            title="Open Live Website in New Tab"
          >
            <span>Live Site</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <Logout />
        </div>
      </div>
    </header>
  );
}
