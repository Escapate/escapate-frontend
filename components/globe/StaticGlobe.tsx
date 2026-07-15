import { Plane } from "lucide-react";

// Fallback for reduced-motion users and while the 3D canvas loads.
export default function StaticGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div className="absolute inset-0 overflow-hidden rounded-full bg-navy-800 ring-1 ring-orange/25 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        {/* equirectangular land map, framed on the Americas/Atlantic */}
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url(/textures/world-map.png)",
            backgroundSize: "200% 100%",
            backgroundPosition: "32% 50%",
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_-24px_-18px_60px_rgba(0,0,0,0.55),inset_18px_14px_40px_rgba(255,255,255,0.06)]" />
      </div>
      <div
        className="pointer-events-none absolute inset-[-7%] rounded-full border border-dashed border-orange/45"
        style={{ transform: "rotate(-18deg)" }}
      />
      <Plane
        className="absolute right-[12%] top-[16%] h-7 w-7 -rotate-[28deg] text-white drop-shadow"
        strokeWidth={1.5}
      />
    </div>
  );
}
