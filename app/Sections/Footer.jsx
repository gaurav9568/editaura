export default function Footer() {
  return (
    <footer
      style={{
        padding: "5rem",
        background: "var(--black)",
        borderTop: "1px solid rgba(200,164,90,0.08)",
        textAlign: "center",
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
          fontSize: "14vw",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "rgba(200,164,90,0.025)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        EDITAURA
      </div>

      <div
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: "2.5rem",
          fontWeight: 600,
          letterSpacing: "0.28em",
          color: "var(--gold)",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
          position: "relative",
        }}
      >
        EDITAURA
      </div>
      <div
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.4em",
          color: "rgba(240,232,216,0.5)",
          textTransform: "uppercase",
          position: "relative",
        }}
      >
        Crafting Cinematic Stories
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          fontWeight: 300,
          color: "rgba(240,232,216,0.5)",
          margin: "1.5rem 0",
          letterSpacing: "0.08em",
          position: "relative",
        }}
      >
        Founded by{" "}
        <b style={{ color: "var(--gold)", fontWeight: 400 }}>Sunil</b>
      </div>
      <div
        style={{
          fontSize: "0.62rem",
          color: "rgba(240,232,216,0.2)",
          letterSpacing: "0.12em",
          position: "relative",
        }}
      >
        © 2025 EDITAURA Video Editing · All rights reserved.
      </div>

    </footer>
  );
}
