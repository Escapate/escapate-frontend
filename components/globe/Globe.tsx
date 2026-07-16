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
  // The canvas bleeds beyond its square container so the orbit path + plane stay
  // fully visible on all sides while the globe keeps its original on-screen size
  // (the camera is pulled back by the same factor in GlobeCanvas).
  return (
    <div className="absolute inset-[-24%]" aria-hidden="true">
      <GlobeCanvas />
    </div>
  );
}
