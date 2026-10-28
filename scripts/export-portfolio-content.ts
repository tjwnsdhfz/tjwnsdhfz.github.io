import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parsePublicPortfolioContent } from "../lib/portfolio-content.ts";

type Manifest = { items: { canonicalId: string; approved: boolean }[] };
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(resolve(root, "content/publication-manifest.json"), "utf8")) as Manifest;
const draft = process.argv.includes("--draft");
const content = parsePublicPortfolioContent(JSON.parse(await readFile(resolve(root, "public/portfolio-content.json"), "utf8")));
const required = new Set(["person:self", "career:kim-seojun", ...content.projects.map((project) => project.canonicalId)]);
const listed = new Map(manifest.items.map((item) => [item.canonicalId, item.approved]));

for (const id of required) {
  if (!listed.has(id)) throw new Error(`publication manifest에 ${id}가 없습니다.`);
  if (!draft && !listed.get(id)) throw new Error(`${id}의 공개 문장과 직접 기여 승인이 필요합니다.`);
}

const output = JSON.stringify(content, null, 2);
const banned: [RegExp, string][] = [
  [/[A-Za-z]:\\|OneDrive|지원서[^\n\"]*\.(?:pdf|docx?|hwp)/i, "로컬 경로 또는 지원서 파일명"],
  [/(?:01[016789])[- .]?\d{3,4}[- .]?\d{4}/, "전화번호"],
  [/2021116351|100\+|312건|16건|9\.5억원|장려상|3위|초대 회장|현재 재직|\bNOW\b/i, "미승인 또는 충돌 주장"],
  [/"evidenceState"\s*:\s*"low"/, "low 확신도"],
];
for (const [pattern, label] of banned) if (pattern.test(output)) throw new Error(`공개 안전 검사 실패: ${label}`);
for (const project of content.projects) {
  if (project.featured) throw new Error(`${project.id}: 대표 프로젝트 승격은 아직 허용되지 않습니다.`);
  for (const ref of project.sourceRefs) if (!ref.startsWith("canonical:") && !ref.startsWith("https://")) throw new Error(`${project.id}: 안전하지 않은 sourceRef`);
}
console.log(draft ? "편집본 JSON의 구조와 공개 안전 검사를 통과했습니다. 파일은 유지됩니다." : "편집본 JSON의 구조·공개 승인 검사를 통과했습니다. 파일은 유지됩니다.");
