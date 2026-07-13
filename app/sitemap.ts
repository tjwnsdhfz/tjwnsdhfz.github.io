import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://tjwnsdhfz.github.io").replace(/\/$/, "");
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

  return [
    {
      url: `${siteOrigin}${basePath}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
