import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("static build contains the requested information architecture", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  for (const label of ["Education", "Career", "Activities", "Credentials", "Projects", "View"]) assert.match(html, new RegExp(label, "i"));
  assert.match(html, /건축의 복잡한 문제를/);
  assert.match(html, /대구경제교육연구소/);
  assert.match(html, /그린하버투자/);
  assert.match(html, /CES 2026/);
  assert.match(html, /해피무브 더 그린/);
  assert.match(html, /<details/);
  assert.match(html, /<summary/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /100\+|312건|9\.5억원|현재 재직|대표 작업/);
});

test("public edit route supports local editing without GitHub token publishing", async () => {
  const edit = await readFile(new URL("../out/edit/index.html", import.meta.url), "utf8");
  const editor = await readFile(new URL("../app/edit/portfolio-editor.tsx", import.meta.url), "utf8");
  assert.match(edit, /내 포트폴리오 직접 수정/);
  assert.match(editor, /JSON 내려받기/);
  assert.match(editor, /내 사진 선택/);
  assert.match(editor, /프로젝트 사진 선택/);
  assert.match(editor, /localStorage/);
  assert.doesNotMatch(`${edit}${editor}`, /api\.github\.com|GitHub에 게시|fine-grained token/);
  await access(new URL("../out/robots.txt", import.meta.url));
  await access(new URL("../out/sitemap.xml", import.meta.url));
});

test("accessibility and motion safeguards remain wired", async () => {
  const [site, css] = await Promise.all([readFile(new URL("../app/portfolio-site.tsx", import.meta.url), "utf8"), readFile(new URL("../app/globals.css", import.meta.url), "utf8")]);
  assert.match(site, /본문 바로가기/);
  assert.match(site, /aria-expanded/);
  assert.match(site, /Escape/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
  assert.match(css, /details\[open\]/);
  assert.match(css, /disclosure-mark/);
  assert.match(css, /@media \(max-width: 760px\)/);
});
