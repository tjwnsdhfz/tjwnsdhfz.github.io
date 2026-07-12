import { DEFAULT_PORTFOLIO_CONTENT } from "../lib/portfolio-content";
import PortfolioSite from "./portfolio-site";

export default function Home() {
  return <PortfolioSite initialContent={DEFAULT_PORTFOLIO_CONTENT} canEdit={false} />;
}
