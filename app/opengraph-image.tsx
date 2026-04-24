import { ImageResponse } from "next/og";

export const alt = "Flametrench — Backbone infrastructure for applications";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 110%, rgba(255,107,53,0.45) 0%, rgba(247,183,51,0.18) 40%, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 60px 60px, 60px 60px",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient
                id="og-flame"
                x1="16"
                y1="4"
                x2="16"
                y2="28"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f7b733" />
                <stop offset="1" stopColor="#ff6b35" />
              </linearGradient>
            </defs>
            <path
              d="M16 6c2.1 4.2 5.8 7.1 5.8 12 0 4.5-2.6 7.3-5.8 7.3s-5.8-2.8-5.8-7.3C10.2 13.1 13.9 10.2 16 6z"
              fill="url(#og-flame)"
            />
          </svg>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            flametrench
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#a3a3a3",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
              padding: "4px 10px",
              marginLeft: 8,
            }}
          >
            v0.1 · draft
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Backbone infrastructure</div>
            <div
              style={{
                display: "flex",
                backgroundImage:
                  "linear-gradient(to bottom, #f7b733, #ff6b35)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              for every application.
            </div>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#a3a3a3",
              display: "flex",
              lineHeight: 1.4,
              maxWidth: 920,
            }}
          >
            An open specification and SDK family for identity, tenancy, and
            authorization.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 18,
            color: "#6b6b6b",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex" }}>UUIDv7</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>Postgres native</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>PHP · Node</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>Apache 2.0</div>
        </div>
      </div>
    ),
    size,
  );
}
