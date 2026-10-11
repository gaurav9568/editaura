"use client";
import { useState, useMemo, useRef } from "react";
import { redirect } from "next/navigation";

const FOLDER_META = {
  premium: { label: "Best Premium Edits", desc: "Top tier motion graphics & high production videos", icon: "💎", defaultType: "short" },
  brand: { label: "Brand Motion Graphics", desc: "Commercial ads & brand storytelling reels", icon: "✨", defaultType: "short" },
  podcast: { label: "Podcast Edits", desc: "Engaging podcast clips with viral captions", icon: "🎙️", defaultType: "short" },
  doctor: { label: "Doctor Style Edits", desc: "Medical explanations, clinical reels & authority building", icon: "🩺", defaultType: "short" },
  long: { label: "Long Videos", desc: "Full length documentaries & YouTube deep-dives (16:9)", icon: "🎥", defaultType: "long" },
  recent: { label: "Recent Best Edits", desc: "Latest released client projects", icon: "⚡", defaultType: "short" },
  other: { label: "Other Edits", desc: "Experimental, social & miscellaneous client work", icon: "📁", defaultType: "short" },
};

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  const str = urlOrId.trim();
  const match = str.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(str)) return str;
  return str;
}

export default function WorkDashboard({ videoData = [], setVideoData, loading }) {
  const [activeCategory, setActiveCategory] = useState("premium");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dirtyCategories, setDirtyCategories] = useState(new Set());

  // Modals state
  const [previewVideo, setPreviewVideo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null); // { index, video }

  // Add video form state
  const [addForm, setAddForm] = useState({
    targetCategory: "premium",
    url: "",
    title: "",
    type: "short",
    customThumb: "",
    uploadingThumb: false,
  });

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ensure all categories exist in normalized structure
  const normalizedData = useMemo(() => {
    const map = {};
    Object.keys(FOLDER_META).forEach((key) => {
      map[key] = { id: key, type: key, videos: [] };
    });

    videoData.forEach((item) => {
      if (item && item.type) {
        const cleanVideos = (item.videos || []).map((v) => {
          if (typeof v === "string") {
            const id = extractYouTubeId(v);
            return {
              yt: id,
              title: "Untitled Project",
              type: FOLDER_META[item.type]?.defaultType || "short",
              thumb: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
              link: `https://www.youtube.com/watch?v=${id}`,
            };
          }
          const id = v.yt || extractYouTubeId(v.link || "");
          return {
            yt: id,
            title: v.title || "Untitled Project",
            type: v.type || (FOLDER_META[item.type]?.defaultType || "short"),
            thumb: v.thumb || (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ""),
            link: v.link || (id ? `https://www.youtube.com/watch?v=${id}` : ""),
          };
        });
        map[item.type] = { id: item.id || item.type, type: item.type, videos: cleanVideos };
      }
    });

    return map;
  }, [videoData]);

  const currentCategoryData = normalizedData[activeCategory] || { videos: [] };

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return currentCategoryData.videos;
    const q = searchQuery.toLowerCase();
    return currentCategoryData.videos.filter(
      (v) =>
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.yt && v.yt.toLowerCase().includes(q))
    );
  }, [currentCategoryData.videos, searchQuery]);

  // Mark category as dirty and update state
  const updateCategoryVideos = (categoryKey, newVideos) => {
    setDirtyCategories((prev) => new Set(prev).add(categoryKey));
    setVideoData((prev) => {
      const exists = prev.some((item) => item.type === categoryKey);
      if (exists) {
        return prev.map((item) =>
          item.type === categoryKey ? { ...item, videos: newVideos } : item
        );
      }
      return [...prev, { id: categoryKey, type: categoryKey, videos: newVideos }];
    });
  };

  // Save changes to API
  const handleSaveCategory = async (categoryKey = activeCategory) => {
    try {
      setIsSaving(true);
      const categoryObj = normalizedData[categoryKey];
      const videosToSave = categoryObj ? categoryObj.videos : [];

      const res = await fetch("/api/work", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: categoryKey,
          videos: videosToSave,
        }),
      });

      if (res.status === 401) {
        redirect("/admin");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      setDirtyCategories((prev) => {
        const next = new Set(prev);
        next.delete(categoryKey);
        return next;
      });

      showToast(`Saved changes for ${FOLDER_META[categoryKey]?.label || categoryKey}!`);
    } catch (err) {
      console.error(err);
      showToast("Error saving videos. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Video
  const handleDeleteVideo = (videoIndex) => {
    const video = currentCategoryData.videos[videoIndex];
    if (!confirm(`Remove "${video.title || "this video"}" from ${FOLDER_META[activeCategory].label}?`)) {
      return;
    }
    const updated = currentCategoryData.videos.filter((_, idx) => idx !== videoIndex);
    updateCategoryVideos(activeCategory, updated);
    showToast(`Removed video. Click "Save Changes" to publish.`, "info");
  };

  // Reorder Videos
  const handleMoveVideo = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= currentCategoryData.videos.length) return;
    const updated = [...currentCategoryData.videos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    updateCategoryVideos(activeCategory, updated);
  };

  // Handle Cloudinary upload
  const handleUploadImage = async (file, onComplete) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onComplete(data.url);
      showToast("Thumbnail uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        onComplete(e.target.result);
        showToast("Thumbnail loaded locally (preview).", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Add Video
  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    const yt = extractYouTubeId(addForm.url);
    if (!yt) {
      alert("Please provide a valid YouTube URL or 11-character Video ID.");
      return;
    }

    const targetCat = addForm.targetCategory;
    const finalThumb =
      addForm.customThumb || `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`;

    const newVideo = {
      yt,
      title: addForm.title.trim() || "Untitled Project",
      type: addForm.type,
      thumb: finalThumb,
      link: `https://www.youtube.com/watch?v=${yt}`,
    };

    const targetList = normalizedData[targetCat]?.videos || [];
    const updated = [newVideo, ...targetList];
    updateCategoryVideos(targetCat, updated);

    setShowAddModal(false);
    setAddForm({
      targetCategory: activeCategory,
      url: "",
      title: "",
      type: FOLDER_META[activeCategory]?.defaultType || "short",
      customThumb: "",
      uploadingThumb: false,
    });

    if (activeCategory !== targetCat) {
      setActiveCategory(targetCat);
    }

    showToast(`Added "${newVideo.title}"! Remember to save changes.`);
  };

  // Submit Edit Video
  const handleSaveEditSubmit = (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    const yt = extractYouTubeId(editingVideo.video.link || editingVideo.video.yt);
    const updatedVideo = {
      ...editingVideo.video,
      yt,
      link: `https://www.youtube.com/watch?v=${yt}`,
    };

    const updated = currentCategoryData.videos.map((v, i) =>
      i === editingVideo.index ? updatedVideo : v
    );

    updateCategoryVideos(activeCategory, updated);
    setEditingVideo(null);
    showToast(`Updated "${updatedVideo.title}"! Remember to save changes.`);
  };

  const isCurrentCategoryDirty = dirtyCategories.has(activeCategory);
  const isCurrentCategoryLong = activeCategory === "long";

  return (
    <div className="w-full relative pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-xl shadow-2xl border transition-all ${
            toastMessage.type === "error"
              ? "bg-red-950 text-red-200 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
              : toastMessage.type === "info"
              ? "bg-amber-950 text-amber-200 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              : "bg-[#111116] text-[#e2c07a] border-[#c8a45a] shadow-[0_0_35px_rgba(200,164,90,0.35)]"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-current animate-ping" />
          <span className="text-xs tracking-wider uppercase font-bold">
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* Main Title Banner */}
      <div className="mb-8 pb-6 border-b border-[#c8a45a]/20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[0.62rem] tracking-[0.35em] uppercase text-[#c8a45a] font-mono font-bold">
            Portfolio Vault Manager
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-gray-400">
            Total {Object.values(normalizedData).reduce((a, b) => a + b.videos.length, 0)} videos across 7 categories
          </span>
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
        >
          Curate <em>Portfolio Videos</em>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-light">
          Manage thumbnails, play previews, reorder sequences, and publish changes directly to the live website.
        </p>
      </div>

      {/* Category Folders Navigation Grid */}
      <div className="mb-8">
        <div className="text-[0.68rem] tracking-[0.25em] uppercase text-[#c8a45a] font-mono font-semibold mb-3">
          Select Category to Manage:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Object.entries(FOLDER_META).map(([key, meta]) => {
            const count = normalizedData[key]?.videos?.length || 0;
            const isActive = activeCategory === key;
            const isDirty = dirtyCategories.has(key);

            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex flex-col items-start justify-between p-3.5 rounded-xl border transition-all text-left group ${
                  isActive
                    ? "bg-[#161622] border-[#c8a45a] text-white shadow-[0_0_25px_rgba(200,164,90,0.25)] ring-1 ring-[#c8a45a]"
                    : "bg-[#0d0d12] border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-lg">{meta.icon}</span>
                  <span
                    className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#c8a45a] text-black"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div className="text-xs font-semibold leading-tight line-clamp-1 group-hover:text-[#c8a45a] transition-colors">
                  {meta.label}
                </div>
                {isDirty && (
                  <span className="mt-1 text-[0.6rem] text-amber-400 font-mono font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Unsaved
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Header Bar with ALWAYS VISIBLE Action Buttons */}
      <div className="bg-[#101017] border-2 border-[#c8a45a]/30 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{FOLDER_META[activeCategory]?.icon}</span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-serif text-white tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
              >
                {FOLDER_META[activeCategory]?.label}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {FOLDER_META[activeCategory]?.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Add Video & Save Changes */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181824] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a45a] transition-colors w-full sm:w-52"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setAddForm((prev) => ({
                ...prev,
                targetCategory: activeCategory,
                type: FOLDER_META[activeCategory]?.defaultType || "short",
              }));
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black shadow-[0_0_20px_rgba(200,164,90,0.35)] hover:scale-103 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add Video</span>
          </button>

          <button
            onClick={() => handleSaveCategory(activeCategory)}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              isCurrentCategoryDirty
                ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-bounce"
                : "bg-white/10 border-[#c8a45a]/40 text-[#f0e8d8] hover:bg-[#c8a45a]/20 hover:border-[#c8a45a]"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{isSaving ? "Saving..." : isCurrentCategoryDirty ? "Save Changes (Unsaved!)" : "Saved to Live Site"}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center text-gray-400 text-sm tracking-wider uppercase font-mono">
          <div className="w-10 h-10 rounded-full border-3 border-[#c8a45a] border-t-transparent animate-spin mx-auto mb-4" />
          Loading collection from vault...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVideos.length === 0 && (
        <div className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-[#c8a45a]/30 bg-[#0e0e14]">
          <div className="w-16 h-16 rounded-full bg-[#c8a45a]/15 border border-[#c8a45a]/40 flex items-center justify-center mx-auto mb-4 text-3xl">
            {FOLDER_META[activeCategory]?.icon}
          </div>
          <h3 className="text-xl font-serif text-white mb-2">
            {searchQuery ? "No matching videos found" : `No videos yet in ${FOLDER_META[activeCategory]?.label}`}
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? "Clear your filter search query to show all videos in this category."
              : "Add your first video to showcase your creative work in this collection."}
          </p>
          <button
            onClick={() => {
              setAddForm((prev) => ({
                ...prev,
                targetCategory: activeCategory,
                type: FOLDER_META[activeCategory]?.defaultType || "short",
              }));
              setShowAddModal(true);
            }}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black hover:scale-105 transition-all shadow-lg"
          >
            + Add First Video
          </button>
        </div>
      )}

      {/* ── VIDEOS GRID (RESPONSIVE & ADAPTIVE CARDS) ── */}
      {!loading && filteredVideos.length > 0 && (
        <div
          className={`grid gap-6 ${
            isCurrentCategoryLong
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
        >
          {filteredVideos.map((video, idx) => {
            const isShort = video.type === "short";
            const actualIndex = currentCategoryData.videos.indexOf(video);

            return (
              <div
                key={`${video.yt}-${actualIndex}`}
                className="group relative bg-[#0e0e14] border-2 border-[#c8a45a]/25 hover:border-[#c8a45a] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(200,164,90,0.2)] flex flex-col"
              >
                {/* ── CARD TOP BAR (ALWAYS VISIBLE: ORDER & REORDER) ── */}
                <div className="bg-[#14141e] px-3.5 py-2.5 border-b border-gray-800 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-mono font-bold bg-[#c8a45a] text-black px-2 py-0.5 rounded-full">
                      #{actualIndex + 1}
                    </span>
                    <span
                      className={`text-[0.62rem] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                        isShort
                          ? "bg-purple-950/80 text-purple-200 border-purple-500/50"
                          : "bg-blue-950/80 text-blue-200 border-blue-500/50"
                      }`}
                    >
                      {isShort ? "🎬 9:16 Short" : "▶ 16:9 Long"}
                    </span>
                  </div>

                  {/* Reorder Up / Down Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveVideo(actualIndex, actualIndex - 1)}
                      disabled={actualIndex === 0}
                      title="Move Earlier in Portfolio"
                      className="w-7 h-7 rounded-lg bg-black/60 hover:bg-[#c8a45a] hover:text-black text-gray-300 disabled:opacity-20 border border-gray-700 flex items-center justify-center transition-all"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveVideo(actualIndex, actualIndex + 1)}
                      disabled={actualIndex === currentCategoryData.videos.length - 1}
                      title="Move Later in Portfolio"
                      className="w-7 h-7 rounded-lg bg-black/60 hover:bg-[#c8a45a] hover:text-black text-gray-300 disabled:opacity-20 border border-gray-700 flex items-center justify-center transition-all"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* ── CARD THUMBNAIL PREVIEW ── */}
                <div
                  className={`relative w-full bg-black overflow-hidden group/thumb cursor-pointer ${
                    isShort ? "aspect-[9/14]" : "aspect-video"
                  }`}
                  onClick={() => setPreviewVideo(video)}
                >
                  <img
                    src={video.thumb}
                    alt={video.title}
                    onError={(e) => {
                      if (video.yt) {
                        e.target.src = `https://img.youtube.com/vi/${video.yt}/hqdefault.jpg`;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                  />

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-black/30 pointer-events-none" />

                  {/* Play circle trigger button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-[#c8a45a]/90 group-hover/thumb:bg-[#e2c07a] text-black flex items-center justify-center pl-0.5 shadow-2xl transform group-hover/thumb:scale-115 transition-all">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    </div>
                  </div>

                  {/* Quick YouTube Tag */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[0.65rem] text-gray-300 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono">
                    <span className="truncate">yt: {video.yt}</span>
                    <span className="text-[#c8a45a] font-bold">Watch ▶</span>
                  </div>
                </div>

                {/* ── CARD CONTENT & DETAILS ── */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-[#0e0e14]">
                  <div className="mb-3">
                    <h3
                      className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#c8a45a] transition-colors"
                      title={video.title}
                    >
                      {video.title || "Untitled Project"}
                    </h3>
                  </div>

                  {/* ── CARD ACTION BUTTONS (ALWAYS VISIBLE & HIGH CONTRAST) ── */}
                  <div className="pt-3 border-t border-gray-800 flex items-center gap-2">
                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewVideo(video)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#c8a45a]/15 hover:bg-[#c8a45a] text-[#e2c07a] hover:text-black border border-[#c8a45a]/50 transition-all"
                      title="Preview Embedded Video"
                    >
                      <span>▶ Play</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingVideo({ index: actualIndex, video: { ...video } })}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/15 text-gray-200 border border-gray-700 hover:border-gray-500 transition-all"
                      title="Edit Title & Link"
                    >
                      <span>✏ Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteVideo(actualIndex)}
                      className="w-9 h-9 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 flex items-center justify-center transition-all"
                      title="Delete Video"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── STICKY BOTTOM FLOATING BAR (ALWAYS ACCESSIBLE WHEN SCROLLING) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0c0c12]/95 border-2 border-[#c8a45a] rounded-full px-5 sm:px-7 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(200,164,90,0.35)] backdrop-blur-xl flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm">{FOLDER_META[activeCategory]?.icon}</span>
          <span className="text-xs text-white font-medium">
            <strong>{FOLDER_META[activeCategory]?.label}</strong> ({currentCategoryData.videos.length} videos)
          </span>
        </div>

        <button
          onClick={() => {
            setAddForm((prev) => ({
              ...prev,
              targetCategory: activeCategory,
              type: FOLDER_META[activeCategory]?.defaultType || "short",
            }));
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
        >
          <span>+ Add Video</span>
        </button>

        <button
          onClick={() => handleSaveCategory(activeCategory)}
          disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg ${
            isCurrentCategoryDirty
              ? "bg-emerald-500 hover:bg-emerald-400 text-black animate-pulse"
              : "bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black"
          }`}
        >
          <span>{isSaving ? "Saving..." : isCurrentCategoryDirty ? "Save Changes *" : "Saved ✓"}</span>
        </button>
      </div>

      {/* ── VIDEO PREVIEW MODAL ──────────────────────── */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-[#0e0e14] border-2 border-[#c8a45a] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#12121a]">
              <div>
                <h3
                  className="text-lg font-serif text-white tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  {previewVideo.title}
                </h3>
                <span className="text-xs text-[#c8a45a] font-mono">
                  {previewVideo.type === "short" ? "🎬 Short / Reel Format" : "▶ Landscape 16:9 Format"} · YouTube ID: {previewVideo.yt}
                </span>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-black flex justify-center">
              <div
                className={`w-full overflow-hidden rounded-xl border border-gray-800 ${
                  previewVideo.type === "short" ? "max-w-[360px] aspect-[9/16]" : "aspect-video"
                }`}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${previewVideo.yt}?autoplay=1&rel=0`}
                  title={previewVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-[#0a0a0e] flex items-center justify-between text-xs text-gray-400">
              <span>Preview embedded player functionality</span>
              <a
                href={previewVideo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c8a45a] font-bold hover:underline"
              >
                Open in YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD VIDEO MODAL ─────────────────────────── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#0e0e14] border-2 border-[#c8a45a] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <div>
                <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c8a45a] font-mono font-bold">
                  New Video Entry
                </span>
                <h3
                  className="text-2xl font-serif text-white tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  Add Video to Portfolio
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="flex flex-col gap-5">
              {/* Category selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Target Portfolio Folder *
                </label>
                <select
                  value={addForm.targetCategory}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setAddForm({
                      ...addForm,
                      targetCategory: cat,
                      type: FOLDER_META[cat]?.defaultType || addForm.type,
                    });
                  }}
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8a45a]"
                >
                  {Object.entries(FOLDER_META).map(([key, meta]) => (
                    <option key={key} value={key} className="bg-[#101018] text-white">
                      {meta.icon} {meta.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* YouTube Link / ID */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  YouTube Video Link or ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                  value={addForm.url}
                  onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a45a] font-mono"
                />
                {extractYouTubeId(addForm.url) && (
                  <p className="text-xs text-emerald-400 font-mono mt-1.5 font-bold">
                    ✓ Recognized YouTube ID: {extractYouTubeId(addForm.url)}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Brand Motion Graphics"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a45a]"
                />
              </div>

              {/* Format Toggle */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Video Aspect Ratio *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, type: "short" })}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      addForm.type === "short"
                        ? "bg-[#c8a45a] text-black border-[#c8a45a] shadow-lg"
                        : "bg-[#181824] border-gray-700 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>🎬 Short / Reel (9:16)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, type: "long" })}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      addForm.type === "long"
                        ? "bg-[#c8a45a] text-black border-[#c8a45a] shadow-lg"
                        : "bg-[#181824] border-gray-700 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>▶ Long Video (16:9)</span>
                  </button>
                </div>
              </div>

              {/* Custom Thumbnail */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Thumbnail Preview
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAddForm((prev) => ({ ...prev, uploadingThumb: true }));
                        handleUploadImage(file, (url) => {
                          setAddForm((prev) => ({
                            ...prev,
                            customThumb: url,
                            uploadingThumb: false,
                          }));
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={addForm.uploadingThumb}
                    className="px-4 py-2 rounded-xl border border-gray-700 hover:border-[#c8a45a] bg-[#181824] text-xs font-bold text-gray-200 hover:text-white"
                  >
                    {addForm.uploadingThumb ? "Uploading..." : "Upload Custom Thumbnail"}
                  </button>

                  {addForm.customThumb && (
                    <button
                      type="button"
                      onClick={() => setAddForm({ ...addForm, customThumb: "" })}
                      className="text-xs text-red-400 hover:text-red-200"
                    >
                      Reset to YouTube Thumb
                    </button>
                  )}
                </div>

                <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-black aspect-video max-w-xs">
                  <img
                    src={
                      addForm.customThumb ||
                      (extractYouTubeId(addForm.url)
                        ? `https://img.youtube.com/vi/${extractYouTubeId(addForm.url)}/maxresdefault.jpg`
                        : "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg")
                    }
                    alt="Preview Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 bg-black/80 px-2.5 py-0.5 rounded text-[0.62rem] text-[#c8a45a] font-mono">
                    {addForm.customThumb ? "Custom Image" : "Auto YouTube HD"}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black shadow-lg hover:scale-103 transition-all"
                >
                  Add Video to {FOLDER_META[addForm.targetCategory]?.label}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT VIDEO MODAL ────────────────────────── */}
      {editingVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setEditingVideo(null)}
        >
          <div
            className="bg-[#0e0e14] border-2 border-[#c8a45a] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <div>
                <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c8a45a] font-mono font-bold">
                  Edit Video Entry
                </span>
                <h3
                  className="text-2xl font-serif text-white tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  Modify Video Details
                </h3>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.video.title}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      video: { ...editingVideo.video, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8a45a]"
                />
              </div>

              {/* YouTube Link / ID */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  YouTube Link or ID
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.video.link || editingVideo.video.yt}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      video: {
                        ...editingVideo.video,
                        link: e.target.value,
                        yt: extractYouTubeId(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#c8a45a]"
                />
              </div>

              {/* Format Toggle */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingVideo({
                        ...editingVideo,
                        video: { ...editingVideo.video, type: "short" },
                      })
                    }
                    className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      editingVideo.video.type === "short"
                        ? "bg-[#c8a45a] text-black border-[#c8a45a] shadow-lg"
                        : "bg-[#181824] border-gray-700 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>🎬 Short / Reel (9:16)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingVideo({
                        ...editingVideo,
                        video: { ...editingVideo.video, type: "long" },
                      })
                    }
                    className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      editingVideo.video.type === "long"
                        ? "bg-[#c8a45a] text-black border-[#c8a45a] shadow-lg"
                        : "bg-[#181824] border-gray-700 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>▶ Long Video (16:9)</span>
                  </button>
                </div>
              </div>

              {/* Thumbnail URL / Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold mb-1.5">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={editingVideo.video.thumb}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      video: { ...editingVideo.video, thumb: e.target.value },
                    })
                  }
                  className="w-full bg-[#181824] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#c8a45a] mb-2"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadImage(file, (url) => {
                          setEditingVideo({
                            ...editingVideo,
                            video: { ...editingVideo.video, thumb: url },
                          });
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-gray-700 hover:border-[#c8a45a] bg-[#181824] text-xs font-bold text-gray-200"
                  >
                    Upload Replacement
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const yt = extractYouTubeId(editingVideo.video.yt || editingVideo.video.link);
                      if (yt) {
                        setEditingVideo({
                          ...editingVideo,
                          video: {
                            ...editingVideo.video,
                            thumb: `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`,
                          },
                        });
                      }
                    }}
                    className="text-xs text-[#c8a45a] font-bold hover:underline"
                  >
                    Reset to YouTube HD
                  </button>
                </div>

                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-700 bg-black aspect-video max-w-xs">
                  <img
                    src={editingVideo.video.thumb}
                    alt="Current Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-5 py-2.5 rounded-full text-xs uppercase font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#c8a45a] to-[#e2c07a] text-black shadow-lg hover:scale-103 transition-all"
                >
                  Save Video Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
