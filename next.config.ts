import type { NextConfig } from "next";

const staticExport = process.env.PORTFOLIO_STATIC_EXPORT === "true";
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
const basePath = configuredBasePath && configuredBasePath !== "/"
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

const nextConfig: NextConfig = {
  output: staticExport ? "export" : undefined,
  trailingSlash: staticExport,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
