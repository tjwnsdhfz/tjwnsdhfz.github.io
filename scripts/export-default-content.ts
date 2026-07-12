import { writeFile } from "node:fs/promises";
import { DEFAULT_PORTFOLIO_CONTENT } from "../lib/portfolio-content.ts";

const output = new URL("../public/portfolio-content.json", import.meta.url);
await writeFile(output, `${JSON.stringify(DEFAULT_PORTFOLIO_CONTENT, null, 2)}\n`, "utf8");
