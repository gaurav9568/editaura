"use client";
import { useState } from "react";

export default function Inquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    details: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in name, email and phone.");
      return;
    }
    // EmailJS integration placeholder
    setSubmitted(true);
  };

  return (
    <section
      id="inquiry"
      style={{
        padding: "9rem 5rem",
        background: "var(--black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "120px",
          background: "linear-gradient(to bottom, transparent, var(--gold3))",
        }}
      />

      <div className="sec-head reveal">
        <span className="sec-label">Get In Touch</span>
        <h2 className="sec-title">
          Start Your <em>Project</em>
        </h2>
        <div className="gline" />
      </div>

      <div
        className="reveal"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "var(--black3)",
          border: "1px solid rgba(200,164,90,0.15)",
          borderRadius: "2px",
          padding: "4rem",
          position: "relative",
        }}
      >
        {/* Top gold line */}
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

        {/* Setup note */}
        <div
          style={{
            background: "rgba(200,164,90,0.06)",
            border: "1px solid rgba(200,164,90,0.18)",
            borderLeft: "3px solid var(--gold)",
            padding: "1.1rem 1.4rem",
            marginBottom: "2rem",
            fontSize: "0.74rem",
            fontWeight: 300,
            color: "rgba(240,232,216,0.5)",
            lineHeight: 1.9,
            borderRadius: "1px",
          }}
        >
          <strong style={{ color: "var(--gold)" }}>
            ⚙️ EmailJS Setup (5 min, free):
          </strong>
          <br />
          1. Sign up at <strong style={{ color: "var(--gold)" }}>
            emailjs.com
          </strong>{" "}
          → connect Gmail &nbsp; 2. Create template with:{" "}
          <code
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.1em 0.4em",
              borderRadius: "2px",
              color: "var(--gold2)",
              fontSize: "0.85em",
            }}
          >
            {"{{client_name}}"}
          </code>{" "}
          <code
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.1em 0.4em",
              borderRadius: "2px",
              color: "var(--gold2)",
              fontSize: "0.85em",
            }}
          >
            {"{{client_email}}"}
          </code>
          <br />
          3. Replace the 3 keys in the script &nbsp;{" "}
          <strong style={{ color: "var(--gold)" }}>
            Delete this once done.
          </strong>
        </div>

        {!submitted ? (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.2rem",
              }}
            >
              <FormField
                label="Your Name *"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Rahul Sharma"
              />
              <FormField
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="rahul@example.com"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.2rem",
              }}
            >
              <FormField
                label="Phone / WhatsApp *"
                type="tel"
                value={formData.phone}
                onChange={handleChange("phone")}
                placeholder="+91 98765 43210"
              />
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={fieldLabelStyle}>Service Needed</label>
                <select
                  value={formData.service}
                  onChange={handleChange("service")}
                  style={fieldInputStyle}
                >
                  <option value="" style={{ background: "var(--black3)" }}>
                    — Select —
                  </option>
                  <option style={{ background: "var(--black3)" }}>
                    YouTube / Long-form Editing
                  </option>
                  <option style={{ background: "var(--black3)" }}>
                    Instagram Reels / Shorts
                  </option>
                  <option style={{ background: "var(--black3)" }}>
                    Podcast Video Editing
                  </option>
                  <option style={{ background: "var(--black3)" }}>
                    Multiple Services
                  </option>
                  <option style={{ background: "var(--black3)" }}>
                    Not Sure Yet
                  </option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={fieldLabelStyle}>About Your Project</label>
              <textarea
                value={formData.details}
                onChange={handleChange("details")}
                placeholder="Content style, turnaround time, budget, references — anything helps!"
                rows={4}
                style={{
                  ...fieldInputStyle,
                  resize: "vertical",
                  minHeight: "115px",
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
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
              Send Inquiry →
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.68rem",
                fontWeight: 300,
                color: "rgba(240,232,216,0.5)",
                marginTop: "1rem",
                letterSpacing: "0.08em",
              }}
            >
              We respond within 24 hours. No spam, ever.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
            <h3
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "2.5rem",
                color: "var(--gold)",
                marginBottom: "0.6rem",
                fontWeight: 400,
              }}
            >
              Inquiry Received!
            </h3>
            <p
              style={{
                color: "rgba(240,232,216,0.5)",
                fontSize: "0.88rem",
                fontWeight: 300,
                lineHeight: 1.9,
              }}
            >
              Thank you for reaching out.
              <br />
              Sunil, Sudarshan or Gaurav will contact you within 24 hours.
            </p>
          </div>
        )}
      </div>

    </section>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={fieldLabelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={fieldInputStyle}
      />
    </div>
  );
}

const fieldLabelStyle = {
  fontSize: "0.6rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--gold)",
  display: "block",
  marginBottom: "0.5rem",
};

const fieldInputStyle = {
  width: "100%",
  background: "rgba(240,232,216,0.03)",
  border: "1px solid rgba(200,164,90,0.15)",
  color: "var(--cream)",
  fontFamily: "var(--font-jost), 'Jost', sans-serif",
  fontSize: "0.88rem",
  fontWeight: 300,
  padding: "0.85rem 1.1rem",
  borderRadius: "1px",
  outline: "none",
};
