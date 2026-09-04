"use client";

export default function Services() {
  const services = [
    {
      num: "01",
      icon: "🎬",
      name: "YouTube Editing",
      desc: "Long-form storytelling with cinematic pacing, color grading, and precision cuts that keep viewers watching till the end.",
    },
    {
      num: "02",
      icon: "📱",
      name: "Reels & Shorts",
      desc: "Snappy, trend-aware vertical edits with dynamic captions and music sync — engineered for maximum reach and shares.",
    },
    {
      num: "03",
      icon: "🎙️",
      name: "Podcast Editing",
      desc: "Clean multi-cam cuts, animated captions, compelling b-roll that transforms raw conversations into must-watch content.",
    },
  ];

  return (
    <section
      id="services"
      style={{
        padding: "7rem 5rem",
        background: "var(--black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: "18vw",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "rgba(200,164,90,0.025)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 0,
          userSelect: "none",
        }}
      >
        EDITAURA
      </div>

      <div className="sec-head reveal">
        <span className="sec-label">What We Do</span>
        <h2 className="sec-title">
          Our <em>Services</em>
        </h2>
        <div className="gline" />
      </div>

      <div
        className="reveal"
        style={{
          display: "flex",
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
        }}
      >
        {services.map((svc, i) => (
          <div
            key={i}
            className="svc-item"
            style={{
              flex: 1,
              minWidth: "220px",
              padding: "3rem 2.5rem",
              textAlign: "center",
              borderRight:
                i < services.length - 1
                  ? "1px solid rgba(200,164,90,0.1)"
                  : "none",
              transition: "background 0.3s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--goldglow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "3.5rem",
                fontWeight: 300,
                color: "rgba(200,164,90,0.18)",
                lineHeight: 1,
                marginBottom: "0.4rem",
              }}
            >
              {svc.num}
            </div>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.8rem" }}>
              {svc.icon}
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                fontWeight: 400,
                color: "var(--cream)",
                marginBottom: "0.5rem",
              }}
            >
              {svc.name}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "rgba(240,232,216,0.5)",
                lineHeight: 1.8,
              }}
            >
              {svc.desc}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
