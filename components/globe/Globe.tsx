"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import StaticGlobe from "./StaticGlobe";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => <StaticGlobe />,
});

export default function Globe() {
  const reduced = useReducedMotion();
  // Respect prefers-reduced-motion: serve a calm, static globe.
  if (reduced) return <StaticGlobe />;
  return (
    <div className="h-full w-full" aria-hidden="true">
      <GlobeCanvas />
    </div>
  );
}
