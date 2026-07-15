"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 0.61, 0.18, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-[0.18em] text-orange-400 sm:text-base">
      <span className="h-px w-8 bg-orange-400/70" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
