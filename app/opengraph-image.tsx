import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          backgroundColor: "#0B0D10",
          color: "#EDEBE8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)",
          backgroundSize: "40px 40px",
          border: "2px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* SD Monogram Badge */}
            <div
              style={{
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #FF6A2B",
                borderRadius: "6px",
                backgroundColor: "rgba(255, 106, 43, 0.12)",
                color: "#FF6A2B",
                fontFamily: "monospace",
                fontSize: "19px",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              SD
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.14em",
                  color: "#FF6A2B",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                // THE SYSTEMS BLUEPRINT
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8B949E",
                  fontFamily: "monospace",
                  letterSpacing: "0.06em",
                }}
              >
                ENGINEERING ARCHITECTURE · 2025
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#8B949E",
            }}
          >
            <span style={{ color: "#EDEBE8", fontWeight: 600 }}>SAURABH DIXIT</span>
            <span>·</span>
            <span>VP OF ENGINEERING</span>
          </div>
        </div>

        {/* Center Headline Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1060px",
          }}
        >
          {/* Signal-orange accent hairline */}
          <div
            style={{
              width: "72px",
              height: "3px",
              backgroundColor: "#FF6A2B",
              borderRadius: "2px",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 106, 43, 0.10)",
              border: "1px solid rgba(255, 106, 43, 0.35)",
              color: "#FF6A2B",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "monospace",
              alignSelf: "flex-start",
            }}
          >
            ROLE: VP OF ENGINEERING · FULL-STACK SYSTEMS ARCHITECT
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 400,
              fontFamily: "Georgia, serif",
              lineHeight: 1.15,
              margin: 0,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            I build the systems behind intelligent products.
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.45,
              color: "#8B949E",
              margin: 0,
              maxWidth: "960px",
            }}
          >
            High-velocity engineering leadership, distributed backend infrastructure, and production AI orchestration at Sensegrass.
          </p>
        </div>

        {/* Bottom Monospace Telemetry Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "18px",
            fontSize: "14px",
            fontFamily: "monospace",
            color: "#6E7681",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>saurabhdixit93.site</span>
            <span>·</span>
            <span>NEXT.JS 15</span>
            <span>·</span>
            <span>DISTRIBUTED ARCHITECTURE</span>
            <span>·</span>
            <span>AI WORKFLOWS</span>
          </div>
          <div
            style={{
              color: "#FF6A2B",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>STATUS: PRODUCTION LIVE</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
