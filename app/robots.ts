import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/content";

// Se genera como /robots.txt estático en el export (Cloudflare Pages).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
    host: BUSINESS.url,
  };
}
