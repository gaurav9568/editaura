"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function PackageDashboard({ packages = [], setPackages, loading }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    billing: "per month",
    features: [""],
  });

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeatureField = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const removeFeatureField = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      alert("Please provide a package name and price.");
      return;
    }

    try {
      setSubmitting(true);
      const cleanFeatures = form.features.filter((f) => f.trim() !== "");

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          features: cleanFeatures.length > 0 ? cleanFeatures : ["Full 4K Video Production", "Fast Revisions"],
        }),
      });

      if (res.status === 401) {
        redirect("/admin");
        return;
      }

      const newPackage = await res.json();
      setPackages((prev) => [...prev, newPackage.pkg]);

      setForm({
        name: "",
        price: "",
        billing: "per month",
        features: [""],
      });
      setShowAddModal(false);
      showToast("Package published successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to create package", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete package "${name || id}"?`)) return;

    try {
      const res = await fetch("/api/packages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        redirect("/admin");
        return;
      }

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      showToast("Package deleted successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete package", "error");
    }
  };

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
              Offerings & Retainers
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-xs text-gray-400">Total {packages.length} tier(s)</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif text-white tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            Packages & <em>Pricing</em>
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Configure client service retainers, video editing packages, and monthly deliverables displayed across the website.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black shadow-[0_0_20px_rgba(200,164,90,0.25)] hover:shadow-[0_0_30px_rgba(200,164,90,0.45)] hover:scale-102 transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Package</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center text-gray-500 text-sm tracking-wider uppercase">
          <div className="w-8 h-8 rounded-full border-2 border-[#c8a45a] border-t-transparent animate-spin mx-auto mb-4" />
          Loading packages...
        </div>
      )}

      {/* Empty State */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-[#c8a45a]/20 bg-[#0e0e14]/40">
          <div className="w-16 h-16 rounded-full bg-[#c8a45a]/10 border border-[#c8a45a]/30 flex items-center justify-center mx-auto mb-4 text-2xl text-[#c8a45a]">
            💎
          </div>
          <h3 className="text-lg font-serif text-white mb-1">No Packages Configured Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Create pricing tiers to showcase your editing retainers and monthly services to prospective clients.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8a45a] text-black hover:bg-[#e2c07a] transition-all cursor-pointer"
          >
            + Create First Package
          </button>
        </div>
      )}

      {/* Packages Grid */}
      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id || idx}
              className="group relative bg-[#0e0e14] border border-[#c8a45a]/20 hover:border-[#c8a45a]/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(200,164,90,0.12)]"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#c8a45a]/40 to-transparent group-hover:via-[#c8a45a] transition-all" />

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#c8a45a] font-mono">
                      Tier {idx + 1}
                    </span>
                    <h3
                      className="text-2xl font-serif text-white tracking-wide mt-0.5"
                      style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                    >
                      {pkg.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(pkg.id, pkg.name)}
                    className="w-8 h-8 rounded-full text-gray-500 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete Package"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-5 border-b border-gray-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#e2c07a]">
                      {pkg.price}
                    </span>
                    {pkg.billing && (
                      <span className="text-xs text-gray-400 font-mono">
                        / {pkg.billing.replace(/^\//, "").trim()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <span className="block text-[0.6rem] tracking-wider uppercase text-gray-500 font-medium mb-3">
                    Deliverables & Inclusions
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {(pkg.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <span className="text-[#c8a45a] mt-0.5 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between text-[0.65rem] text-gray-500 font-mono">
                <span>ID: {pkg.id?.slice(0, 8)}...</span>
                <span className="text-emerald-400/80">● Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD PACKAGE MODAL ───────────────────────── */}
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
                  Service Tiers
                </span>
                <h3
                  className="text-2xl font-serif text-white tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  Create Package
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-1.5 font-medium">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YouTube Growth Suite or Cinematic Tier"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors"
                />
              </div>

              {/* Price & Billing row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-1.5 font-medium">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $1,499"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-1.5 font-medium">
                    Billing Cycle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. per month or per video"
                    value={form.billing}
                    onChange={(e) => setForm({ ...form, billing: e.target.value })}
                    className="w-full bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors"
                  />
                </div>
              </div>

              {/* Features List */}
              <div>
                <label className="block text-[0.65rem] tracking-wider uppercase text-gray-400 mb-2 font-medium">
                  Deliverables & Included Features
                </label>

                <div className="flex flex-col gap-2.5">
                  {form.features.map((feature, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-[#c8a45a] text-xs font-mono w-4">{i + 1}.</span>
                      <input
                        type="text"
                        className="flex-1 bg-[#15151e] border border-gray-800 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a45a] transition-colors"
                        placeholder={`e.g. ${
                          i === 0 ? "8x 4K YouTube Long Form Videos" : i === 1 ? "Custom Motion Graphics & Sound Design" : "Feature deliverable"
                        }`}
                        value={feature}
                        onChange={(e) => handleFeatureChange(i, e.target.value)}
                      />
                      {form.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(i)}
                          className="w-8 h-8 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-1 text-xs text-[#c8a45a] hover:text-[#e2c07a] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-[#c8a45a]/10 w-fit transition-colors cursor-pointer"
                  >
                    <span>+ Add Another Deliverable</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
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
                  {submitting ? "Publishing..." : "Publish Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
