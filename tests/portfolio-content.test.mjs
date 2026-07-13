import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  applyGeneralProfile,
  sanitizePortfolioContent,
} from "../lib/portfolio-content.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("general profile preset preserves facts and capability evidence by stable meaning", () => {
  const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
  content.careerFacts = [
    content.careerFacts[1],
    { label: "Target", value: "특정 기업 맞춤" },
    content.careerFacts[2],
    content.careerFacts[3],
  ];
  content.roleFit = content.roleFit
    .map((item) => ({ ...item, evidence: `custom-evidence:${item.id}` }))
    .reverse();

  const result = applyGeneralProfile(content);

  assert.equal(result.careerFacts[0].label, "Education");
  assert.equal(result.careerFacts[0].value, "경북대학교 건축학과 5년제");
  assert.deepEqual(result.careerFacts.map((fact) => fact.label), ["Education", "Focus", "GPA", "Language"]);
  assert.deepEqual(result.roleFit.map((item) => item.id), DEFAULT_PORTFOLIO_CONTENT.roleFit.map((item) => item.id));
  for (const item of result.roleFit) assert.equal(item.evidence, `custom-evidence:${item.id}`);
  assert.equal(result.hero.primaryCta.href, "#selected-work");
});

test("legacy capability rows gain stable ids after reordering", () => {
  const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
  legacy.roleFit = legacy.roleFit.reverse().map((item) => {
    const withoutId = { ...item };
    delete withoutId.id;
    return withoutId;
  });

  const sanitized = sanitizePortfolioContent(legacy);
  assert.deepEqual(
    sanitized.roleFit.map((item) => item.id),
    ["field-team", "quality-control", "system-review", "requirements"],
  );
});

test("published portfolio data has unique anchors, valid proof targets, and existing local images", async () => {
  const raw = JSON.parse(await readFile(path.join(projectRoot, "public", "portfolio-content.json"), "utf8"));
  const content = sanitizePortfolioContent(raw);
  const projectIds = content.projects.map((project) => project.id);
  const repositoryIds = content.repositories.map((repository) => repository.id);
  const capabilityIds = content.roleFit.map((item) => item.id);

  assert.equal(new Set(projectIds).size, projectIds.length);
  assert.equal(new Set(repositoryIds).size, repositoryIds.length);
  assert.equal(new Set(capabilityIds).size, capabilityIds.length);
  assert.equal(content.hero.primaryCta.href, "#selected-work");

  const knownTargets = new Set(["selected-work", "role-fit", "experience", "repositories", "contact", ...projectIds]);
  for (const item of content.roleFit) {
    assert.ok(item.evidenceLabel.length > 0);
    if (item.evidenceHref.startsWith("#")) {
      assert.ok(knownTargets.has(item.evidenceHref.slice(1)), `unknown evidence target: ${item.evidenceHref}`);
    }
  }

  for (const image of [content.hero.image, ...content.projects.filter((project) => project.visible).map((project) => project.image)]) {
    if (image.startsWith("/")) await access(path.join(projectRoot, "public", image.slice(1)));
  }
});
