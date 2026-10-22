"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useAdmin } from "../components/AdminProvider";

const defaultFolderLabels = {
  premium: "Best Premium Edits",
  brand: "Brand Motion Graphics",
  podcast: "Podcast Edits",
  doctor: "Doctor Style Edits",
  long: "Long Videos",
  recent: "Recent Best Edits",
  other: "Other Edits",
};

const defaultThumbs = [
  "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
  "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
];

function ytId(s) {
  if (!s || typeof s !== "string") return "";
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : s.trim();
}

function parseVideoItem(item, folderKey) {
  if (!item) return null;

  if (typeof item === "object") {
    const rawUrl = item.link || item.url || item.yt || "";
    const id = ytId(rawUrl || (typeof item.yt === "string" ? item.yt : ""));
    const link = rawUrl.startsWith("http")
      ? rawUrl
      : id ? `https://www.youtube.com/watch?v=${id}` : "#";
    const thumb =
      item.thumb ||
      (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : defaultThumbs[0]);

    return {
      yt: id || item.yt || "video",
      title: item.title || "Untitled Video",
      type: item.type || (rawUrl.includes("shorts") ? "short" : "long"),
      thumb,
      link,
    };
  }

  if (typeof item === "string") {
    const id = ytId(item);
    const isShort = item.includes("shorts");
    const link = item.startsWith("http")
      ? item
      : id ? `https://www.youtube.com/watch?v=${id}` : "#";
    const thumb = id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : defaultThumbs[0];

    return {
      yt: id,
      title: "YouTube Video",
      type: isShort ? "short" : "long",
      thumb,
      link,
    };
  }

  return null;
}

export default function Portfolio() {
  const { isAdmin } = useAdmin();
  const [folderData, setFolderData] = useState({
    premium: [],
    brand: [],
    podcast: [],
    doctor: [],
    long: [],
    recent: [],
    other: [],
  });
  const [folderLabels, setFolderLabels] = useState(defaultFolderLabels);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [openPanel, setOpenPanel] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForFolder, setAddForFolder] = useState("premium");
  const [videoType, setVideoType] = useState("long");
  const [avUrl, setAvUrl] = useState("");
  const [avTitle, setAvTitle] = useState("");
  const [thumbDataURL, setThumbDataURL] = useState(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoadingVideos(true);
      const res = await fetch("/api/work");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.videos || !Array.isArray(data.videos)) return;

      const newFolderData = {
        premium: [],
        brand: [],
        podcast: [],
        doctor: [],
        long: [],
        recent: [],
        other: [],
      };
      const newFolderLabels = { ...defaultFolderLabels };

      data.videos.forEach((doc) => {
        const rawKey = (doc.id || doc.type || "").toLowerCase().trim();
        if (!rawKey) return;

        const rawVideos = Array.isArray(doc.videos) ? doc.videos : [];
        const parsed = rawVideos
          .map((v) => parseVideoItem(v, rawKey))
          .filter(Boolean);

        newFolderData[rawKey] = parsed;

        if (doc.title || doc.label) {
          newFolderLabels[rawKey] = (doc.title || doc.label).trim();
        } else if (!newFolderLabels[rawKey]) {
          newFolderLabels[rawKey] =
            rawKey.charAt(0).toUpperCase() + rawKey.slice(1).replace(/[-_]/g, " ");
        }
      });

      setFolderData(newFolderData);
      setFolderLabels(newFolderLabels);
    } catch (err) {
      console.error("Error fetching videos from Firestore:", err);
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const saveFolderToFirestore = async (folderKey, updatedVideos) => {
    try {
      await fetch("/api/work", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: folderKey,
          videos: updatedVideos,
        }),
      });
    } catch (err) {
      console.error("Error saving folder to Firestore:", err);
    }
  };

  const handleThumb = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setThumbDataURL(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const addVideo = async () => {
    if (!avUrl) {
      alert("Please enter a YouTube link.");
      return;
    }
    const id = ytId(avUrl);
    const link = avUrl.startsWith("http")
      ? avUrl
      : `https://www.youtube.com/watch?v=${id}`;
    const autoThumb = id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : defaultThumbs[0];

    const videoObj = {
      yt: id,
      title: avTitle || "Untitled Video",
      type: videoType,
      thumb: thumbDataURL || autoThumb,
      link,
    };

    const nextFolderVideos = [...(folderData[addForFolder] || []), videoObj];

    setFolderData((prev) => ({
      ...prev,
      [addForFolder]: nextFolderVideos,
    }));

    setShowAddModal(false);
    setAvUrl("");
    setAvTitle("");
    setThumbDataURL(null);
    setVideoType("long");

    await saveFolderToFirestore(addForFolder, nextFolderVideos);
  };

  const deleteVideo = async (key, idx) => {
    if (!confirm("Remove this video?")) return;
    const nextFolderVideos = (folderData[key] || []).filter((_, i) => i !== idx);

    setFolderData((prev) => ({
      ...prev,
      [key]: nextFolderVideos,
    }));

    await saveFolderToFirestore(key, nextFolderVideos);
  };

  const openAdd = (key) => {
    setAddForFolder(key);
    setAvUrl("");
    setAvTitle("");
    setThumbDataURL(null);
    setVideoType("long");
    setShowAddModal(true);
  };

  return (
    <>
      <section
        id="portfolio"
        style={{
          minHeight: "100vh",
          padding: "10rem 5rem 8rem",
          background: "var(--black)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              radial-gradient(ellipse 70% 50% at 50% -10%, rgba(200,164,90,0.07) 0%, transparent 65%),
              repeating-linear-gradient(90deg, rgba(200,164,90,0.012) 0px, rgba(200,164,90,0.012) 1px, transparent 1px, transparent 100px),
              repeating-linear-gradient(0deg, rgba(200,164,90,0.008) 0px, rgba(200,164,90,0.008) 1px, transparent 1px, transparent 100px)
            `,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-2rem",
            right: "-2rem",
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "20vw",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "rgba(200,164,90,0.022)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          EDITAURA
        </div>

        {/* Intro Video Section */}
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "6rem",
            opacity: 0,
            animation: "riseIn 0.9s ease 1.5s forwards",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 20,
            position: "relative"
          }}
        >
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2 style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontSize: "1.8rem",
              color: "var(--gold)",
              letterSpacing: "0.2em",
              fontWeight: 300,
              textTransform: "uppercase"
            }}>
              EDITAURA
            </h2>
            <p style={{
              fontSize: "0.8rem",
              letterSpacing: "0.4em",
              color: "rgba(240,232,216,0.6)",
              textTransform: "uppercase",
              marginTop: "0.5rem"
            }}>
              The Cinematic Experience
            </p>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 0 80px rgba(200,164,90,0.22)",
              border: "1px solid rgba(200,164,90,0.25)",
              aspectRatio: "16/9",
              backgroundColor: "#080810"
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/cM8eO1X9XwY?autoplay=1&mute=1&loop=1&playlist=cM8eO1X9XwY&controls=0&modestbranding=1&rel=0"
              title="Editaura Cinematic Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </div>

        <div className="sec-head reveal" style={{ paddingTop: "2rem" }}>
          <span className="sec-label">EDITAURA</span>
          <h2 className="sec-title">
            Our <em>Work</em>
          </h2>
          <div className="gline" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "1.2rem",
            maxWidth: "1260px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          {Object.entries(folderLabels).map(([key, label]) => (
            <FolderCard
              key={key}
              folderKey={key}
              label={label}
              count={(folderData[key] || []).length}
              thumbs={
                (folderData[key] || []).length > 0
                  ? folderData[key].slice(0, 3).map((v) => v.thumb)
                  : defaultThumbs
              }
              onClick={() => setOpenPanel(key)}
            />
          ))}
        </div>
      </section>

      {/* Folder Panels */}
      {Object.entries(folderLabels).map(([key, label]) => (
        <FolderPanel
          key={key}
          folderKey={key}
          label={label}
          isOpen={openPanel === key}
          onClose={() => setOpenPanel(null)}
          videos={folderData[key] || []}
          isAdmin={isAdmin}
          onAdd={() => openAdd(key)}
          onDelete={(idx) => deleteVideo(key, idx)}
        />
      ))}

      {/* Add Video Modal */}
      {showAddModal && (
        <AddVideoModal
          videoType={videoType}
          setVideoType={setVideoType}
          avUrl={avUrl}
          setAvUrl={setAvUrl}
          avTitle={avTitle}
          setAvTitle={setAvTitle}
          thumbDataURL={thumbDataURL}
          handleThumb={handleThumb}
          onClose={() => setShowAddModal(false)}
          onAdd={addVideo}
          addForFolder={addForFolder}
          setAddForFolder={setAddForFolder}
          folderLabels={folderLabels}
        />
      )}

    </>
  );
}

/* ── FOLDER CARD ──────────────────────────────────── */
function FolderCard({ folderKey, label, count, thumbs, onClick }) {
  return (
    <div
      className="folder-card reveal"
      data-folder={folderKey}
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "3px",
        background: "var(--black3)",
        border: "1px solid rgba(200,164,90,0.14)",
        cursor: "pointer",
        transition: "transform 0.4s, border-color 0.4s, box-shadow 0.4s",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-7px) scale(1.01)";
        e.currentTarget.style.borderColor = "rgba(200,164,90,0.55)";
        e.currentTarget.style.boxShadow =
          "0 28px 70px rgba(0,0,0,0.7), 0 0 35px rgba(200,164,90,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "rgba(200,164,90,0.14)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Tab */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60%",
          height: "6px",
          background:
            "linear-gradient(to right, var(--gold3), rgba(200,164,90,0.3))",
          borderRadius: "0 0 4px 0",
        }}
      />

      {/* Count */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "14px",
          zIndex: 3,
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gold)",
          background: "rgba(6,6,8,0.7)",
          border: "1px solid rgba(200,164,90,0.3)",
          padding: "0.25rem 0.6rem",
          borderRadius: "10px",
        }}
      >
        {count} {count === 1 ? "video" : "videos"}
      </div>

      {/* Thumb strip */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: "140px",
          overflow: "hidden",
          marginTop: "6px",
          position: "relative",
        }}
      >
        {thumbs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              flex: 1,
              minWidth: 0,
              objectFit: "cover",
              filter: "brightness(0.55)",
              transition: "filter 0.4s",
              borderLeft: i === 1 ? "1px solid rgba(0,0,0,0.5)" : undefined,
              borderRight: i === 1 ? "1px solid rgba(0,0,0,0.5)" : undefined,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(6,6,8,0.88) 100%)",
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          padding: "1.1rem 1.3rem 1.3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "var(--cream)",
            transition: "color 0.3s",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(200,164,90,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s, border-color 0.3s",
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12,5 19,12 12,19" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ── FOLDER PANEL ─────────────────────────────────── */
function FolderPanel({ folderKey, label, isOpen, onClose, videos, isAdmin, onAdd, onDelete }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(6,6,8,0.97)",
        overflowY: "auto",
        padding: "5rem",
        animation: "panelIn 0.4s ease",
      }}
    >
      {/* Grain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1260px",
          margin: "0 auto 3rem",
          borderBottom: "1px solid rgba(200,164,90,0.15)",
          paddingBottom: "1.5rem",
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            fontSize: "0.68rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(240,232,216,0.5)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-jost), 'Jost', sans-serif",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--gold)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(240,232,216,0.5)")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          Back to Work
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {isAdmin && (
            <button
              onClick={onAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gold)",
                background: "rgba(200,164,90,0.08)",
                border: "1px solid rgba(200,164,90,0.25)",
                padding: "0.55rem 1.2rem",
                borderRadius: "1px",
                cursor: "pointer",
                fontFamily: "var(--font-jost), 'Jost', sans-serif",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200,164,90,0.15)";
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(200,164,90,0.08)";
                e.currentTarget.style.borderColor = "rgba(200,164,90,0.25)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Video
            </button>
          )}
          <div
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              fontWeight: 300,
              color: "var(--cream)",
              textAlign: "right",
            }}
          >
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>
              {label}
            </em>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.2rem",
          maxWidth: "1260px",
          margin: "0 auto",
        }}
      >
        {videos.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 2rem",
              color: "rgba(240,232,216,0.5)",
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              opacity: 0.5,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1"
              style={{ display: "block", margin: "0 auto 1rem", opacity: 0.3 }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            No videos yet in this folder.
          </div>
        )}
        {videos.map((video, idx) => (
          <VideoCard
            key={idx}
            video={video}
            isAdmin={isAdmin}
            onDelete={() => onDelete(idx)}
          />
        ))}
      </div>

    </div>
  );
}

/* ── VIDEO CARD ───────────────────────────────────── */
function VideoCard({ video, isAdmin, onDelete }) {
  const isPortrait = video.type === "short";

  return (
    <a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2px",
        border: "1px solid rgba(200,164,90,0.1)",
        cursor: "pointer",
        transition: "transform 0.4s, border-color 0.4s, box-shadow 0.4s",
        background: "var(--black3)",
        display: "block",
        textDecoration: "none",
        aspectRatio: isPortrait ? "9/16" : "16/9",
        maxWidth: isPortrait ? "280px" : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-7px) scale(1.01)";
        e.currentTarget.style.borderColor = "rgba(200,164,90,0.5)";
        e.currentTarget.style.boxShadow =
          "0 28px 70px rgba(0,0,0,0.7), 0 0 35px rgba(200,164,90,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "rgba(200,164,90,0.1)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <img
        src={video.thumb}
        alt={video.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s",
          display: "block",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.15) 50%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.1rem",
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 400,
            color: "var(--cream)",
          }}
        >
          {video.title}
        </div>
        <div
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginTop: "0.2rem",
          }}
        >
          {video.type === "short" ? "🎬 Short / Reel" : "▶ Long Video"}
        </div>
      </div>

      {/* Play icon */}
      <div
        className="play-overlay"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "rgba(200,164,90,0.12)",
          border: "1.5px solid rgba(200,164,90,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="var(--gold)"
          style={{ width: "18px", marginLeft: "3px" }}
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>

      {/* Admin delete */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 5,
            background: "rgba(200,50,50,0.8)",
            border: "none",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            color: "#fff",
          }}
        >
          ✕
        </button>
      )}
    </a>
  );
}

/* ── ADD VIDEO MODAL ──────────────────────────────── */
function AddVideoModal({
  videoType,
  setVideoType,
  avUrl,
  setAvUrl,
  avTitle,
  setAvTitle,
  thumbDataURL,
  handleThumb,
  onClose,
  onAdd,
  addForFolder,
  setAddForFolder,
  folderLabels = defaultFolderLabels,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "rgba(6,6,8,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--black3)",
          border: "1px solid rgba(200,164,90,0.2)",
          padding: "2.8rem",
          width: "min(540px, 94vw)",
          borderRadius: "3px",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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
          onClick={onClose}
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

        <h3
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "1.9rem",
            fontWeight: 400,
            color: "var(--gold)",
            marginBottom: "0.3rem",
          }}
        >
          Add Video
        </h3>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(240,232,216,0.5)",
            letterSpacing: "0.08em",
            marginBottom: "1.8rem",
          }}
        >
          Admin Panel · EDITAURA Studio
        </p>

        {/* Type toggle */}
        <label style={labelStyle}>Video Type</label>
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.4rem" }}>
          <TypeBtn
            active={videoType === "long"}
            onClick={() => setVideoType("long")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <polygon points="10,9 16,12 10,15" />
            </svg>
            Long / Landscape (16:9)
          </TypeBtn>
          <TypeBtn
            active={videoType === "short"}
            onClick={() => setVideoType("short")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="7" y="2" width="10" height="20" rx="2" />
              <polygon points="10,9 15,12 10,15" />
            </svg>
            Short / Reels (9:16)
          </TypeBtn>
        </div>

        <label style={labelStyle}>YouTube Link *</label>
        <input
          type="text"
          value={avUrl}
          onChange={(e) => setAvUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          style={inputStyle}
        />

        <label style={labelStyle}>Video Title *</label>
        <input
          type="text"
          value={avTitle}
          onChange={(e) => setAvTitle(e.target.value)}
          placeholder="My Project Title"
          style={inputStyle}
        />

        <label style={labelStyle}>Category</label>
        <select
          value={addForFolder}
          onChange={(e) => setAddForFolder(e.target.value)}
          style={inputStyle}
        >
          {Object.entries(folderLabels).map(([k, v]) => (
            <option
              key={k}
              value={k}
              style={{ background: "var(--black3)" }}
            >
              {v}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Thumbnail Image *</label>
        {!thumbDataURL ? (
          <div
            style={{
              border: "1px dashed rgba(200,164,90,0.25)",
              borderRadius: "2px",
              padding: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "1.2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleThumb}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
              }}
            />
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              🖼️
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: "rgba(240,232,216,0.5)",
              }}
            >
              Click to upload thumbnail
            </div>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--gold3)",
                marginTop: "0.3rem",
                letterSpacing: "0.08em",
              }}
            >
              JPG, PNG, WEBP — recommended 1280×720 for landscape · 720×1280
              for portrait
            </div>
          </div>
        ) : (
          <img
            src={thumbDataURL}
            alt="Preview"
            style={{
              width: "100%",
              borderRadius: "2px",
              marginBottom: "1.2rem",
              border: "1px solid rgba(200,164,90,0.2)",
            }}
          />
        )}

        <button
          onClick={onAdd}
          style={{
            width: "100%",
            padding: "1.05rem",
            background: "var(--gold)",
            color: "var(--black)",
            fontFamily: "var(--font-jost), 'Jost', sans-serif",
            fontSize: "0.66rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "1px",
            cursor: "pointer",
            transition: "background 0.3s, transform 0.2s",
            marginTop: "0.4rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--gold2)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--gold)";
            e.currentTarget.style.transform = "";
          }}
        >
          Add to Portfolio →
        </button>
      </div>
    </div>
  );
}

function TypeBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "0.7rem",
        fontFamily: "var(--font-jost), 'Jost', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        border: `1px solid ${active ? "var(--gold)" : "rgba(200,164,90,0.2)"}`,
        background: active ? "rgba(200,164,90,0.15)" : "transparent",
        color: active ? "var(--gold)" : "rgba(240,232,216,0.5)",
        cursor: "pointer",
        borderRadius: "1px",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      {children}
    </button>
  );
}

const labelStyle = {
  fontSize: "0.6rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--gold)",
  display: "block",
  marginBottom: "0.4rem",
};

const inputStyle = {
  width: "100%",
  background: "rgba(240,232,216,0.03)",
  border: "1px solid rgba(200,164,90,0.18)",
  color: "var(--cream)",
  fontFamily: "var(--font-jost), 'Jost', sans-serif",
  fontSize: "0.88rem",
  padding: "0.72rem 1rem",
  borderRadius: "1px",
  marginBottom: "1.2rem",
  outline: "none",
};
