export const metadata = {
  title: "EDITAURA — Studio Admin Dashboard",
  description: "Manage portfolio videos, service packages, and FAQs for Editaura Studio.",
};

export default function AdminLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-[#060608] text-[#f0e8d8] selection:bg-[#c8a45a] selection:text-black"
      style={{ cursor: "default" }}
    >
      <style>{`
        /* Restore cursor visibility in admin panel */
        html, body, div, button, input, select, textarea, a {
          cursor: auto !important;
        }
        button, a, select, input[type="file"], input[type="submit"] {
          cursor: pointer !important;
        }
        /* Custom scrollbar for admin */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #08080c;
        }
        ::-webkit-scrollbar-thumb {
          background: #252532;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #c8a45a;
        }
      `}</style>
      {children}
    </div>
  );
}
