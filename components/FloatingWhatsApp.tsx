"use client";

import { useI18n } from "@/lib/i18n";
import { waLink } from "@/lib/content";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const { c } = useI18n();
  return (
    <a
      href={waLink(c.wa.hello)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-[#06351a] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
