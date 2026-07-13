import { PUBLISHED_PORTFOLIO_CONTENT } from "../lib/published-portfolio-content";
import PortfolioSite from "./portfolio-site";

export default function Home() {
  const content = PUBLISHED_PORTFOLIO_CONTENT;
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://tjwnsdhfz.github.io").replace(/\/$/, "");
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  const profileUrl = `${siteOrigin}${basePath}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${content.identity.name} 포트폴리오`,
    url: profileUrl,
    mainEntity: {
      "@type": "Person",
      name: content.identity.name,
      alternateName: content.identity.englishName,
      email: content.identity.email,
      url: profileUrl,
      sameAs: [content.identity.github],
      jobTitle: content.identity.role,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "경북대학교",
      },
      knowsAbout: content.capabilities.map((capability) => capability.title),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PortfolioSite initialContent={content} canEdit={false} />
    </>
  );
}
