import type { Metadata } from "next";
import { DEFAULT_PORTFOLIO_CONTENT } from "../../lib/portfolio-content";
import PortfolioSite from "../portfolio-site";

export const metadata: Metadata = {
  title: "포트폴리오 편집 | 김서준",
  description: "김서준 포트폴리오의 콘텐츠를 편집하고 외부 호스팅에 게시합니다.",
  robots: { index: false, follow: false },
};

export default function EditPage() {
  return (
    <PortfolioSite
      initialContent={DEFAULT_PORTFOLIO_CONTENT}
      canEdit
      initialEditorOpen
    />
  );
}
