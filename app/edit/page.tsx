import { PUBLISHED_PORTFOLIO_CONTENT } from "../../lib/published-portfolio-content";
import PortfolioEditor from "./portfolio-editor";

export const metadata = { title: "포트폴리오 직접 수정", robots: { index: false, follow: false } };

export default function EditPage() {
  return <PortfolioEditor initialContent={PUBLISHED_PORTFOLIO_CONTENT} />;
}
