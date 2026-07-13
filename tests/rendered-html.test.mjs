import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

test("build contains the Apple-editorial GitHub portfolio", async () => {
  const [defaults, site, layout] = await Promise.all([
    readFile(new URL("../lib/portfolio-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio-site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  await access(new URL("../out/index.html", import.meta.url));
  assert.match(layout, /<html lang="ko">/i);
  assert.match(layout, /김서준 \| 설계·데이터·디지털 프로젝트 포트폴리오/i);
  assert.match(defaults, /복잡한 요구를/);
  assert.match(defaults, /확인 가능한 결과로 바꿉니다/);
  assert.match(defaults, /3\.86 \/ 4\.5/);
  assert.match(defaults, /OPIc IH/);
  assert.match(defaults, /DatumGuard/);
  assert.match(defaults, /v0\.3\.0/);
  assert.match(defaults, /376 \+ 35/);
  assert.match(defaults, /BARAM 2026/);
  assert.match(defaults, /HONEST BOUNDARY|roleBoundary/);
  assert.match(defaults, /Modu Brain/);
  assert.match(defaults, /GreenMiles MVP/);
  assert.match(defaults, /tjwnsdhfz\/datumguard/);
  assert.match(defaults, /100\+/);
  assert.match(defaults, /약 9\.5억/);
  assert.match(defaults, /thatsceo@naver\.com/);
  assert.match(site, /내용 편집/);
  assert.match(site, /본문 바로가기/);
  assert.match(site, /mobile-menu-trigger/);
  assert.match(site, /primaryNavigation/);
  assert.match(site, /aria-current/);
  assert.match(site, /새 탭에서 열림/);
  assert.match(site, /tabIndex=\{-1\}/);
  assert.match(site, /지원자 핵심 정보/);
  assert.match(site, /role-fit-section/);
  assert.match(site, /role-fit-capability/);
  assert.match(site, /is-proof/);
  assert.match(site, /repository-grid shell.*is-single/);
  assert.match(site, /compact-details/);
  assert.match(site, /section-edit-trigger/);
  assert.match(site, /initialTab/);
  assert.match(site, /핵심 역량/);
  assert.match(site, /업무 적용 방식/);
  assert.doesNotMatch(`${defaults}${site}${layout}`, /HD현대중공업|조선 상세설계|상세설계 연결/i);
  assert.doesNotMatch(`${defaults}${site}`, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps repository editing, GitHub Pages publishing, and Apple design constraints wired", async () => {
  const [page, editPage, site, editor, defaults, layout, css, packageJson, nextConfig, workflow, contentJson, deploymentGuide] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/edit/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio-site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/content-editor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/portfolio-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../public/portfolio-content.json", import.meta.url), "utf8"),
    readFile(new URL("../docs/DEPLOYMENT.md", import.meta.url), "utf8"),
  ]);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
  await assert.rejects(access(new URL("../app/api/content/route.ts", templateRoot)));
  await assert.rejects(access(new URL("../db/index.ts", templateRoot)));
  await assert.rejects(access(new URL("../.openai/hosting.json", templateRoot)));
  await access(new URL("public/og-apple.png", templateRoot));
  await access(new URL("public/projects/baram-validation.svg", templateRoot));
  await access(new URL("public/portfolio-content.json", templateRoot));
  await access(new URL("docs/DEPLOYMENT.md", templateRoot));

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /drizzle/);
  assert.match(packageJson, /build:portable/);
  assert.match(packageJson, /content:sync/);
  assert.match(layout, /\/og-apple\.png/);
  assert.match(layout, /<html lang="ko">/);
  assert.doesNotMatch(page, /headers|force-dynamic|readPortfolioContent/);
  assert.match(editPage, /initialEditorOpen/);
  assert.match(editPage, /robots/);
  assert.match(site, /ContentEditor/);
  assert.match(site, /portfolio-content\.json/);
  assert.match(site, /RepositoryCard/);
  assert.match(site, /repository-section/);
  assert.match(site, /localStorage/);
  assert.match(site, /loading="lazy"/);
  assert.match(editor, /JSON 내보내기/);
  assert.match(editor, /브라우저 초안 저장/);
  assert.match(editor, /GitHub에 게시/);
  assert.match(editor, /api\.github\.com/);
  assert.match(editor, /Contents: Read and write/);
  assert.match(editor, /Pinned repositories/);
  assert.match(editor, /채용 핵심 정보/);
  assert.match(editor, /역량-근거 매핑/);
  assert.match(editor, /과장 방지 경계/);
  assert.match(editor, /브라우저 초안 자동 저장/);
  assert.match(editor, /previouslyFocusedRef/);
  assert.match(editor, /querySelectorAll<HTMLElement>/);
  assert.match(editor, /prefers-reduced-motion: reduce/);
  assert.match(editor, /defaultOpen=\{index === 0\}/);
  assert.match(editor, /복제/);
  assert.match(editor, /범용 자기소개 적용/);
  assert.match(editor, /applyGeneralProfile/);
  assert.match(editor, /이전 직무 초안 불러오기/);
  assert.match(editor, /GitHub 공개본은 게시 전까지 바뀌지 않습니다/);
  assert.match(site, /PORTFOLIO_DRAFT_STORAGE_KEY/);
  assert.match(editor, /PORTFOLIO_DRAFT_STORAGE_KEY/);
  assert.match(defaults, /kim-seojun-portfolio-draft-v3-general/);
  assert.doesNotMatch(editor, /open=\{index === 0\}/);
  assert.match(editor, /저장소 추가/);
  assert.match(editor, /프로젝트 추가/);
  assert.match(nextConfig, /output: staticExport \? "export"/);
  assert.match(nextConfig, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /NEXT_PUBLIC_GITHUB_REPO/);
  assert.equal(JSON.parse(contentJson).repositories.length, 3);
  assert.equal(JSON.parse(contentJson).roleFit.length, 4);
  assert.equal(JSON.parse(contentJson).projects.find((project) => project.id === "baram-2026").visible, true);
  assert.match(deploymentGuide, /tjwnsdhfz\.github\.io/);
  assert.match(deploymentGuide, /Cloudflare Pages/);

  assert.match(css, /--blue:\s*#0066cc/);
  assert.match(css, /--blue-dark:\s*#2997ff/);
  assert.match(css, /\.repository-grid/);
  assert.match(css, /\.repository-grid\.is-single/);
  assert.match(css, /\.repository-card/);
  assert.match(css, /\.career-facts/);
  assert.match(css, /\.mobile-menu-trigger/);
  assert.match(css, /\.section-edit-trigger/);
  assert.match(css, /\.details-count-5/);
  assert.match(css, /\.role-fit-grid/);
  assert.match(css, /\.role-fit-capability/);
  assert.match(css, /\.role-boundary/);
  assert.match(css, /\.compact-details/);
  assert.match(css, /\.editor-tab-select/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
  assert.match(css, /@media \(max-width: 734px\)/);
  assert.doesNotMatch(css, /global-nav nav a:not\(:last-child\)/);
  assert.doesNotMatch(css, /#d6a24a|linear-gradient|radial-gradient/i);
});
