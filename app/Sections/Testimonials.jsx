"use client";

export default function Testimonials() {
  const testimonials = [
    {
      initials: "AK",
      name: "Arjun Kapoor",
      role: "YouTube Creator · 500K subs",
      text: "EDITAURA transformed our raw footage into something truly cinematic. Our YouTube channel growth doubled after the rebrand — the quality is absolutely unmatched.",
    },
    {
      initials: "PS",
      name: "Priya Sharma",
      role: "Podcast Host · The Growth Lab",
      text: "Our podcast went from bland to brand. The team understood our voice perfectly and made our visuals match it. Fast turnaround, incredible communication.",
    },
    {
      initials: "RV",
      name: "Rahul Verma",
      role: "Brand Founder · Lumina Co.",
      text: "Best investment for my brand. The Reels they produced got 3× more reach than anything I'd posted before. Sunil, Sudarshan and Gaurav are true artists.",
    },
  ];

  return (
    <section
      id="testimonials"
      style={{
        padding: "9rem 5rem",
        background: "var(--black2)",
        position: "relative",
      }}
    >
      {/* Bottom gold glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(200,164,90,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="sec-head reveal">
        <span className="sec-label">Client Love</span>
        <h2 className="sec-title">
          <em>Testimonials</em>
        </h2>
        <div className="gline" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="tcard reveal"
            style={{
              background: "var(--black3)",
              border: "1px solid rgba(200,164,90,0.1)",
              borderRadius: "2px",
              padding: "2.2rem",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(200,164,90,0.35)";
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 20px 50px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200,164,90,0.1)";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            {/* Quote mark */}
            <div
              style={{
                position: "absolute",
                top: "-1.5rem",
                right: "1.5rem",
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "9rem",
                fontWeight: 700,
                lineHeight: 1,
                color: "rgba(200,164,90,0.07)",
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </div>
            {/* Top line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(200,164,90,0.3), transparent)",
              }}
            />

            <div
              style={{
                color: "var(--gold)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                marginBottom: "0.9rem",
              }}
            >
              ★★★★★
            </div>
            <p
              style={{
                fontSize: "0.88rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "rgba(240,232,216,0.5)",
                marginBottom: "1.6rem",
              }}
            >
              {t.text}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--gold3), var(--black3))",
                  border: "1px solid rgba(200,164,90,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--gold)",
                  flexShrink: 0,
                }}
              >
                {t.initials}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 400,
                    color: "var(--cream)",
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginTop: "0.15rem",
                  }}
                >
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
