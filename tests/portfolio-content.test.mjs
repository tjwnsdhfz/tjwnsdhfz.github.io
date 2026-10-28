import assert from "node:assert/strict";
import { access, readFile, mkdtemp, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parsePortfolioContent, parsePublicPortfolioContent, sanitizePortfolioContent } from "../lib/portfolio-content.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const rawText = await readFile(path.join(root, "public/portfolio-content.json"), "utf8");
const content = sanitizePortfolioContent(JSON.parse(rawText));

test("imports reject incomplete nested data and executable URLs before rendering", () => {
  assert.throws(() => parsePortfolioContent({ version: 2 }), /identity/);
  for (const mutate of [
    (draft) => { draft.projects[0].links[0].href = "javascript:alert(1)"; },
    (draft) => { draft.experiences = null; },
    (draft) => { draft.projects[0].tags = [null]; },
    (draft) => { draft.projects[1].id = draft.projects[0].id; },
    (draft) => { draft.hero.image = "//external.example/photo.jpg"; },
  ]) {
    const draft = structuredClone(content); mutate(draft);
    assert.throws(() => parsePortfolioContent(draft));
  }
  const draft = structuredClone(content);
  draft.identity.name = "편집한 이름";
  draft.hero.image = "data:image/png;base64,iVBORw0KGgo=";
  assert.equal(parsePortfolioContent(draft).identity.name, "편집한 이름");
});

test("publication validation preserves the user's edited JSON byte for byte", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "portfolio-publication-"));
  try {
    for (const dir of ["scripts", "lib", "content", "public"]) await mkdir(path.join(fixture, dir));
    for (const file of ["scripts/export-portfolio-content.ts", "lib/portfolio-content.ts", "content/publication-manifest.json"]) await copyFile(path.join(root, file), path.join(fixture, file));
    const draft = structuredClone(content); draft.hero.title = "직접 수정한 포트폴리오 문장";
    const edited = JSON.stringify(draft, null, 4) + "\n";
    const file = path.join(fixture, "public/portfolio-content.json");
    await writeFile(file, edited);
    execFileSync(process.execPath, ["--experimental-strip-types", path.join(fixture, "scripts/export-portfolio-content.ts")], { stdio: "pipe" });
    assert.equal(await readFile(file, "utf8"), edited);
    draft.experiences[0].visibility = "private";
    await writeFile(file, JSON.stringify(draft));
    assert.throws(() => execFileSync(process.execPath, ["--experimental-strip-types", path.join(fixture, "scripts/export-portfolio-content.ts")], { stdio: "pipe" }));
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

test("private draft items cannot enter public JSON or static build props", () => {
  for (const key of ["education", "experiences", "activities", "projects"]) {
    const draft = structuredClone(content); draft[key][0].visibility = "private";
    assert.doesNotThrow(() => parsePortfolioContent(draft));
    assert.throws(() => parsePublicPortfolioContent(draft), /비공개 항목/);
  }
});

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
