import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/content";

// Landing de una sola página → una sola URL. Se genera como /sitemap.xml estático.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BUSINESS.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
