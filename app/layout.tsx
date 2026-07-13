import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "김서준 | 설계·데이터·디지털 프로젝트 포트폴리오";
const description =
  "건축 설계와 현장 운영, CAD·데이터 검증, 디지털 프로젝트에서 문제를 정의하고 결과를 검증해 온 김서준의 포트폴리오입니다.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/" },
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
      siteName: "Kim Seojun Portfolio",
      images: [
        {
          url: `${basePath}/og-apple.png`,
          width: 1728,
          height: 909,
          alt: "김서준 설계·데이터·디지털 프로젝트 포트폴리오",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${basePath}/og-apple.png`],
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
