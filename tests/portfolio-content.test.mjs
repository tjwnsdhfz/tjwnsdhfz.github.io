import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { sanitizePortfolioContent } from "../lib/portfolio-content.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const rawText = await readFile(path.join(root, "public/portfolio-content.json"), "utf8");
const content = sanitizePortfolioContent(JSON.parse(rawText));

test("public data uses the evidence schema and has no featured project", () => {
  assert.equal(content.version, 2);
  assert.ok(content.projects.length >= 4);
  assert.equal(content.experiences.length, 4);
  assert.ok(content.activities.length >= 8);
  assert.ok(content.experiences.every((item) => item.period && item.organization && item.role));
  assert.ok(content.activities.every((item) => item.period && item.organization && item.role));
  assert.ok(content.projects.every((project) => project.featured === false));
  assert.ok(content.projects.every((project) => project.myRole && project.proof && project.boundary));
  assert.equal(new Set(content.projects.map((project) => project.canonicalId)).size, content.projects.length);
});

test("public data omits private paths, identifiers, and unapproved claims", () => {
  assert.doesNotMatch(rawText, /[A-Za-z]:\\|OneDrive|2021116351|100\+|312건|16건|9\.5억원|장려상|3위|초대 회장|현재 재직|\bNOW\b/i);
  assert.doesNotMatch(rawText, /"evidenceState"\s*:\s*"low"/);
  assert.match(rawText, /thatsceo@naver\.com/);
});

test("all local public images exist and source refs are safe", async () => {
  for (const image of [content.hero.image, ...content.projects.map((project) => project.image)]) {
    if (image.startsWith("/")) await access(path.join(root, "public", image.slice(1)));
  }
  for (const project of content.projects) for (const ref of project.sourceRefs) assert.match(ref, /^(canonical:|https:\/\/)/);
});
