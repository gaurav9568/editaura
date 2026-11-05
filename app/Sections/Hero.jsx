"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    let t = 0;
    let animFrame;

    function resize() {
      W = canvas.width = canvas.offsetWidth || window.innerWidth;
      H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.6 + 0.15,
      op: Math.random() * 0.45 + 0.05,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.14,
      ph: Math.random() * Math.PI * 2,
    }));

    const beams = [
      { ox: 0.12, angle: -0.22, w: 160, b: 0.05 },
      { ox: 0.42, angle: -0.1, w: 280, b: 0.04 },
      { ox: 0.68, angle: 0.08, w: 110, b: 0.035 },
      { ox: 0.88, angle: -0.18, w: 90, b: 0.028 },
    ];

    function draw() {
      t++;
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.5, W * 0.9);
      bg.addColorStop(0, "#0e0c09");
      bg.addColorStop(0.45, "#080810");
      bg.addColorStop(1, "#040406");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Ambient gold glow
      const ag = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.45);
      ag.addColorStop(0, `rgba(200,164,90,${0.055 + 0.015 * Math.sin(t * 0.007)})`);
      ag.addColorStop(1, "rgba(200,164,90,0)");
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, W, H);

      // Beams
      beams.forEach((b) => {
        const fl = 0.75 + 0.25 * Math.sin(t * 0.0013 + b.ox * 20);
        ctx.save();
        ctx.translate(b.ox * W, 0);
        ctx.rotate(b.angle);
        const grd = ctx.createLinearGradient(0, 0, 0, H * 1.5);
        grd.addColorStop(0, "rgba(200,164,90,0)");
        grd.addColorStop(0.2, `rgba(200,164,90,${b.b * fl})`);
        grd.addColorStop(0.6, `rgba(200,164,90,${b.b * 0.55 * fl})`);
        grd.addColorStop(1, "rgba(200,164,90,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(-b.w / 2, 0, b.w, H * 1.5);
        ctx.restore();
      });

      // Horizon line
      const hl = ctx.createLinearGradient(0, 0, W, 0);
      hl.addColorStop(0, "rgba(200,164,90,0)");
      hl.addColorStop(0.5, `rgba(200,164,90,${0.07 + 0.02 * Math.sin(t * 0.009)})`);
      hl.addColorStop(1, "rgba(200,164,90,0)");
      ctx.fillStyle = hl;
      ctx.fillRect(0, H * 0.46, W, 1);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.ph += 0.015;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const a = p.op * (0.65 + 0.35 * Math.sin(p.ph));
        ctx.beginPath();
        ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,164,90,${a})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="grain" />
      <div className="scanlines" />
      <div className="vignette" />
      <div
        className="lbox-t"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 4,
          pointerEvents: "none",
          background: "var(--black)",
          height: "55px",
          top: 0,
        }}
      />
      <div
        className="lbox-b"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 4,
          pointerEvents: "none",
          background: "var(--black)",
          height: "55px",
          bottom: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "2rem",
            opacity: 0,
            animation: "riseIn 0.9s ease 0.3s forwards",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.2rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "40px",
              height: "1px",
              background: "var(--gold3)",
            }}
          />
          Cinematic &nbsp;·&nbsp; Precision &nbsp;·&nbsp; Story
          <span
            style={{
              display: "inline-block",
              width: "40px",
              height: "1px",
              background: "var(--gold3)",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "clamp(5.5rem, 16vw, 13rem)",
            fontWeight: 300,
            lineHeight: 0.88,
            letterSpacing: "0.1em",
            color: "var(--cream)",
            textTransform: "uppercase",
            opacity: 0,
            animation: "riseIn 1.1s ease 0.55s forwards",
            textShadow:
              "0 0 80px rgba(200,164,90,0.18), 0 0 160px rgba(200,164,90,0.08)",
          }}
        >
          EDITAURA
        </h1>

        <div
          style={{
            width: "1px",
            height: "70px",
            background:
              "linear-gradient(to bottom, var(--gold), transparent)",
            margin: "2rem auto",
            opacity: 0,
            animation: "riseIn 0.9s ease 0.9s forwards",
          }}
        />

        <p
          style={{
            fontSize: "0.78rem",
            fontWeight: 300,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(240,232,216,0.5)",
            lineHeight: 2.2,
            opacity: 0,
            animation: "riseIn 0.9s ease 1.1s forwards",
          }}
        >
          <b style={{ color: "var(--gold)", fontWeight: 400 }}>
            Video Editing Studio
          </b>{" "}
          · Sunil
          <br />
          YouTube &nbsp;·&nbsp; Reels &nbsp;·&nbsp; Podcast — crafted to
          captivate
        </p>

        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "2.5rem",
            opacity: 0,
            animation: "riseIn 0.9s ease 1.3s forwards",
          }}
        >
          <Link href="#portfolio" className="btn-gold">
            View Our Work
          </Link>
          <Link href="#inquiry" className="btn-ghost">
            Start a Project
          </Link>
        </div>


      </div>

      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0,
          animation: "riseIn 0.9s ease 1.8s forwards",
        }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(240,232,216,0.5)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "50px",
            background:
              "linear-gradient(to bottom, var(--gold), transparent)",
            animation: "scrollPulse 2.2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
