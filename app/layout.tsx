import type { Metadata, Viewport } from "next";
import { PUBLISHED_PORTFOLIO_CONTENT } from "../lib/published-portfolio-content";
import "./globals.css";

const published = PUBLISHED_PORTFOLIO_CONTENT;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tjwnsdhfz.github.io";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const canonicalPath = `${basePath}/` || "/";
const compactRole = published.identity.role.replace(/\s*·\s*/g, "·");
const title = `${published.identity.name} | ${compactRole} 포트폴리오`;
const description = published.hero.description.slice(0, 160);

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: canonicalPath },
    keywords: [
      "김서준",
      "취업 포트폴리오",
      "설계",
      "데이터 검증",
      "디지털 프로젝트",
      "CAD",
      "BIM",
      "DXF",
      "IFC",
      "DatumGuard",
      "GitHub Portfolio",
    ],
    authors: [{ name: "김서준" }],
    creator: "김서준",
    icons: {
      icon: `${basePath}/favicon.png`,
      shortcut: `${basePath}/favicon.png`,
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title,
      description,
      url: canonicalPath,
      siteName: "Kim Seojun Portfolio",
      images: [
        {
          url: `${basePath}/og-apple.jpg`,
          width: 1200,
          height: 630,
          alt: "김서준 설계·데이터·디지털 프로젝트 포트폴리오",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${basePath}/og-apple.jpg`],
    },
  };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
