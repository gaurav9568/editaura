"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function FaqDashboard({ faqs = [], setFaqs, loading }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = async (id, questionText) => {
    if (!confirm(`Delete FAQ: "${questionText || "this question"}"?`)) return;

    try {
      const res = await fetch(`/api/faqs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        redirect("/admin");
        return;
      }

      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      showToast("FAQ removed successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete FAQ", "error");
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Please provide both a question and an answer.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
        }),
      });

      if (res.status === 401) {
        redirect("/admin");
        return;
      }

      const data = await res.json();
      setFaqs((prev) => [...prev, data.faq]);

      setNewQuestion("");
      setNewAnswer("");
      setShowAddModal(false);
      showToast("FAQ added successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to add FAQ", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      (f.question && f.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.answer && f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full relative pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-md shadow-2xl border transition-all animate-fade-in ${
            toastMessage.type === "error"
              ? "bg-red-950/90 text-red-200 border-red-500/40"
              : "bg-[#111116]/95 text-[#e2c07a] border-[#c8a45a]/50 shadow-[0_0_25px_rgba(200,164,90,0.2)]"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs tracking-wider uppercase font-medium">
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#c8a45a]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[0.62rem] tracking-[0.35em] uppercase text-[#c8a45a] font-mono">
              Knowledge Base
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-xs text-gray-400">Total {faqs.length} question(s)</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif text-white tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            Client <em>FAQs</em>
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Frequently asked questions about turnaround time, revision rounds, raw footage transfer, and licensing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black shadow-[0_0_20px_rgba(200,164,90,0.25)] hover:shadow-[0_0_30px_rgba(200,164,90,0.45)] hover:scale-102 transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {faqs.length > 0 && (
        <div className="mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111116] border border-gray-800 rounded-full px-5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a45a] transition-colors"
          />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center text-gray-500 text-sm tracking-wider uppercase">
          <div className="w-8 h-8 rounded-full border-2 border-[#c8a45a] border-t-transparent animate-spin mx-auto mb-4" />
          Loading questions...
        </div>
      )}

      {/* Empty State */}
      {!loading && faqs.length === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-[#c8a45a]/20 bg-[#0e0e14]/40">
          <div className="w-16 h-16 rounded-full bg-[#c8a45a]/10 border border-[#c8a45a]/30 flex items-center justify-center mx-auto mb-4 text-2xl text-[#c8a45a]">
            💬
          </div>
          <h3 className="text-lg font-serif text-white mb-1">No FAQs Added Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Help prospective clients understand your workflows, revision policies, and turnaround times by adding questions.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8a45a] text-black hover:bg-[#e2c07a] transition-all cursor-pointer"
          >
            + Create First FAQ
          </button>
        </div>
      )}

      {/* FAQs List */}
      {!loading && filteredFaqs.length > 0 && (
        <div className="flex flex-col gap-4 max-w-4xl">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="group relative bg-[#0e0e14] border border-[#c8a45a]/15 hover:border-[#c8a45a]/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-[#c8a45a]/10 border border-[#c8a45a]/30 text-[#c8a45a] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-white group-hover:text-[#e2c07a] transition-colors leading-snug">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed font-light pl-0 border-t border-gray-800/60 pt-2.5">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(faq.id, faq.question)}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                  title="Delete FAQ"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD FAQ MODAL ───────────────────────────── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#0e0e14] border border-[#c8a45a]/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
              <div>
                <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c8a45a] font-mono">
                  Knowledge Base
                </span>
                <h3
                  className="text-2xl font-serif text-white tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  Add FAQ
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="flex flex-col gap-5">
              <div>
                <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-1.5 font-medium">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is your typical turnaround time per video?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-1.5 font-medium">
                  Detailed Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. For YouTube long-form videos our standard delivery is 48-72 hours. Reels and Shorts are delivered within 24 hours with dedicated revisions."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black hover:scale-102 transition-all cursor-pointer shadow-[0_0_20px_rgba(200,164,90,0.3)]"
                >
                  {submitting ? "Publishing..." : "Publish FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
