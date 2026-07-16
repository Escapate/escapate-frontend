import { ImageResponse } from "next/og";

export const alt = "Escápate · Agencia de viajes en Cúcuta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Se genera en build (export estático) → public al compartir el link.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #16253F 0%, #0C1B2F 70%)",
          color: "#F5F1E9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            letterSpacing: 4,
            fontSize: 22,
            fontWeight: 700,
            color: "#F0A04B",
          }}
        >
          <span>PASE DE ABORDAR</span>
          <span style={{ width: 60, height: 2, background: "#F0A04B", opacity: 0.6 }} />
          <span>BOARDING PASS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 112,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
            }}
          >
            Tu viaje empieza&nbsp;
            <span style={{ color: "#E8732A" }}>aquí.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(245,241,233,0.8)" }}>
            Vuelos, hoteles y planes a tu medida — desde Cúcuta hacia el mundo.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          <span>ESCÁPATE</span>
          <span style={{ color: "rgba(245,241,233,0.55)" }}>
            AGENCIA DE VIAJES · CÚCUTA · COLOMBIA
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
