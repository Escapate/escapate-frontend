import { ImageResponse } from "next/og";

// apple-touch-icon (iOS "añadir a inicio"). Se genera en build como PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// El avión de papel de la marca, embebido como SVG y centrado sobre el navy.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 64 64">
  <path d="M6 50 Q20 44 30 36" fill="none" stroke="#F0A04B" stroke-width="2.4" stroke-dasharray="1.5 5" stroke-linecap="round"/>
  <path d="M9 33 55 9 34 57 29 39 Z" fill="#E8732A"/>
  <path d="M29 39 55 9" fill="none" stroke="#0C1B2F" stroke-width="2.4" stroke-linecap="round"/>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C1B2F",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={120}
          height={120}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(mark)}`}
          alt=""
        />
      </div>
    ),
    { ...size }
  );
}
