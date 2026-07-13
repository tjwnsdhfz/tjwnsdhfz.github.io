import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://tjwnsdhfz.github.io").replace(/\/$/, "");
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  const siteRoot = `${siteOrigin}${basePath}`;

  return {
    rules: {
      userAgent: "*",
      allow: `${basePath}/`,
      disallow: `${basePath}/edit/`,
    },
    sitemap: `${siteRoot}/sitemap.xml`,
    host: siteOrigin,
  };
}
