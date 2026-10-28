import publishedContent from "../public/portfolio-content.json";
import { parsePublicPortfolioContent } from "./portfolio-content";

/**
 * The published JSON is the build-time source of truth for the public site.
 * DEFAULT_PORTFOLIO_CONTENT remains the reusable template and preset source.
 */
export const PUBLISHED_PORTFOLIO_CONTENT = parsePublicPortfolioContent(publishedContent);
