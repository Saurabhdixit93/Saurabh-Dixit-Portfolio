import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0D10",
          borderRadius: "6px",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hairline Outer Box */}
          <rect
            x="5.5"
            y="5.5"
            width="25"
            height="25"
            rx="2"
            stroke="#FF6A2B"
            strokeWidth="1.5"
            fill="rgba(255, 106, 43, 0.15)"
          />
          {/* S Path */}
          <path
            d="M16 11.5H11.5C10.5 11.5 9.5 12.3 9.5 13.5V14.5C9.5 15.7 10.5 16.5 11.5 16.5H14C15.2 16.5 16 17.3 16 18.5V20C16 21.2 15.2 22 14 22H9"
            stroke="#EDEBE8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* D Path */}
          <path
            d="M20 11.5V22.5M20 11.5H23C25.5 11.5 27 13.5 27 17C27 20.5 25.5 22.5 23 22.5H20"
            stroke="#FF6A2B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
