import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/content/case-studies";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  const title = study ? study.title : "Systems Architecture Case Study";
  const role = study ? study.role : "Lead Architect & Engineer";
  const year = study ? study.year : 2024;
  const pitch = study
    ? study.pitch || study.subtitle
    : "Production architecture, distributed systems, and AI engineering case study.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0B0D10",
          color: "#F3F0E8",
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
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#FF6A2B",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                letterSpacing: "0.15em",
                color: "#FF6A2B",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              // SYSTEMS ARCHITECTURE BLUEPRINT · {year}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "16px",
              fontFamily: "monospace",
              color: "#94a3b8",
            }}
          >
            <span>SAURABH DIXIT</span>
            <span>·</span>
            <span>PORTFOLIO SPEC</span>
          </div>
        </div>

        {/* Center Hero Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "1000px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 106, 43, 0.12)",
              border: "1px solid rgba(255, 106, 43, 0.35)",
              color: "#FF6A2B",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "monospace",
              alignSelf: "flex-start",
            }}
          >
            ROLE: {role.toUpperCase()}
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 600,
              lineHeight: 1.15,
              margin: 0,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.45,
              color: "#94a3b8",
              margin: 0,
              maxWidth: "920px",
            }}
          >
            {pitch}
          </p>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span>TOPOLOGY: SVG + REDIS + LLM</span>
            <span>·</span>
            <span>VERIFIED ARCHITECTURE</span>
          </div>
          <div style={{ color: "#FF6A2B", fontWeight: 600 }}>
            saurabhdixit93.site/work/{slug}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
