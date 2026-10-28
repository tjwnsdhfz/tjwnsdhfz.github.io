"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import type { PortfolioContent } from "../../lib/portfolio-content";
import { parsePortfolioContent } from "../../lib/portfolio-content";
import PortfolioSite from "../portfolio-site";

const STORAGE_KEY = "kim-seojun-portfolio-local-draft-v4";
type Tab = "profile" | "career" | "activities" | "projects" | "raw";

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const id = useId();
  return <div className="editor-field"><label htmlFor={id}>{label}</label>{multiline ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} /> : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />}</div>;
}

async function imageData(event: ChangeEvent<HTMLInputElement>): Promise<string | null> {
  const file = event.target.files?.[0];
  if (!file) return null;
  if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) throw new Error("PNG, JPEG, WebP, GIF 이미지를 선택해주세요.");
  if (file.size > 5_000_000) throw new Error("이미지는 5MB 이하로 선택해주세요.");
  return await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
}

export default function PortfolioEditor({ initialContent }: { initialContent: PortfolioContent }) {
  const [draft, setDraft] = useState(initialContent);
  const [tab, setTab] = useState<Tab>("profile");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const frame = requestAnimationFrame(() => { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setDraft(parsePortfolioContent(JSON.parse(saved))); } catch { setStatus("저장된 초안을 읽지 못해 공개본을 열었습니다. 기존 저장 데이터는 유지됩니다."); } }); return () => cancelAnimationFrame(frame); }, []);
  const save = () => { try { parsePortfolioContent(draft); localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); setStatus("이 브라우저에 임시저장했습니다. 공개 사이트에는 반영되지 않습니다."); } catch (error) { setStatus(error instanceof Error && error.name === "QuotaExceededError" ? "브라우저 저장 공간이 부족합니다. 현재 편집본을 JSON으로 내려받거나 이미지 크기를 줄여주세요." : `저장하지 못했습니다. ${error instanceof Error ? error.message : "브라우저 저장 설정을 확인해주세요."}`); } };
  const previewDraft = () => { try { parsePortfolioContent(draft); setPreview(true); } catch (error) { setStatus(`미리보기를 열지 못했습니다. ${error instanceof Error ? error.message : "입력 내용을 확인해주세요."}`); } };
  const download = () => { try { parsePortfolioContent(draft); const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "portfolio-content.json"; anchor.click(); URL.revokeObjectURL(url); setStatus("편집본 JSON을 내려받았습니다."); } catch (error) { setStatus(`내려받지 못했습니다. ${error instanceof Error ? error.message : "입력 내용을 확인해주세요."}`); } };
  const importJson = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { if (file.size > 25_000_000) throw new Error("JSON은 25MB 이하로 선택해주세요."); const next = parsePortfolioContent(JSON.parse(await file.text())); setDraft(next); setStatus("JSON을 불러왔습니다. 내용을 확인한 뒤 임시저장하거나 내려받으세요."); } catch (error) { setStatus(`불러오지 못했습니다. ${error instanceof Error ? error.message : "JSON 형식을 확인해주세요."} 현재 편집본은 유지됩니다.`); } finally { event.target.value = ""; } };

  if (preview) return <><button className="preview-exit" type="button" onClick={() => setPreview(false)}>← 편집으로 돌아가기</button><PortfolioSite content={draft} /></>;

  return <main className="editor-shell">
    <header className="editor-header"><div><p className="eyebrow">LOCAL CONTENT EDITOR</p><h1>내 포트폴리오 직접 수정</h1><p>문장과 사진을 이 브라우저에서 고치고 JSON으로 내려받을 수 있습니다. GitHub 토큰을 받거나 자동 게시하지 않습니다.</p></div>
      <div className="editor-actions"><Link href="/">공개본 보기</Link><button type="button" onClick={previewDraft}>편집본 미리보기</button><button type="button" onClick={() => importRef.current?.click()}>JSON 불러오기</button><button type="button" onClick={save}>임시저장</button><button className="primary" type="button" onClick={download}>JSON 내려받기</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importJson} /></div>
    </header>
    <p className="editor-note">사진은 5MB 이하 파일을 선택할 수 있습니다. 내려받은 JSON을 검토한 뒤 저장소의 <code>public/portfolio-content.json</code>과 교체하면 됩니다. 사용자 승인과 검증 전에는 배포하지 마세요.</p>
    <div className="editor-grid"><nav className="editor-nav" aria-label="편집 구역">{(["profile", "career", "activities", "projects", "raw"] as Tab[]).map((item) => <button className={tab === item ? "is-active" : ""} key={item} type="button" onClick={() => setTab(item)}>{({ profile: "프로필", career: "경력", activities: "활동", projects: "프로젝트", raw: "전체 JSON" } as Record<Tab,string>)[item]}</button>)}</nav>
      <section className="editor-panel">
        {tab === "profile" && <><h2>프로필과 첫 화면</h2><Field label="한글 이름" value={draft.identity.name} onChange={(value) => setDraft({ ...draft, identity: { ...draft.identity, name: value } })} /><Field label="영문 이름" value={draft.identity.englishName} onChange={(value) => setDraft({ ...draft, identity: { ...draft.identity, englishName: value } })} /><Field label="포지셔닝" value={draft.identity.role} onChange={(value) => setDraft({ ...draft, identity: { ...draft.identity, role: value } })} /><Field label="첫 문장" value={draft.hero.title} onChange={(value) => setDraft({ ...draft, hero: { ...draft.hero, title: value } })} /><Field label="강조 문장" value={draft.hero.highlight} onChange={(value) => setDraft({ ...draft, hero: { ...draft.hero, highlight: value } })} /><Field label="소개" value={draft.about.description} multiline onChange={(value) => setDraft({ ...draft, about: { ...draft.about, description: value } })} /><Field label="프로필 이미지 경로 또는 URL" value={draft.hero.image} onChange={(value) => setDraft({ ...draft, hero: { ...draft.hero, image: value } })} /><label className="file-button">내 사진 선택<input hidden type="file" accept="image/*" onChange={async (event) => { try { const value = await imageData(event); if (value) setDraft({ ...draft, hero: { ...draft.hero, image: value } }); } catch (error) { setStatus(String(error)); } }} /></label></>}
        {tab === "career" && <><h2>경력</h2>{draft.experiences.map((item, index) => <div className="editor-card" key={index}><h3>{index + 1}. {item.organization}</h3><Field label="기간" value={item.period} onChange={(value) => setDraft({ ...draft, experiences: draft.experiences.map((row, i) => i === index ? { ...row, period: value } : row) })} /><Field label="기관" value={item.organization} onChange={(value) => setDraft({ ...draft, experiences: draft.experiences.map((row, i) => i === index ? { ...row, organization: value } : row) })} /><Field label="역할" value={item.role} onChange={(value) => setDraft({ ...draft, experiences: draft.experiences.map((row, i) => i === index ? { ...row, role: value } : row) })} /><Field label="설명" value={item.description} multiline onChange={(value) => setDraft({ ...draft, experiences: draft.experiences.map((row, i) => i === index ? { ...row, description: value } : row) })} /></div>)}</>}
        {tab === "activities" && <><h2>활동</h2>{draft.activities.map((item, index) => <div className="editor-card" key={index}><h3>{index + 1}. {item.role}</h3><Field label="기간" value={item.period} onChange={(value) => setDraft({ ...draft, activities: draft.activities.map((row, i) => i === index ? { ...row, period: value } : row) })} /><Field label="활동명" value={item.role} onChange={(value) => setDraft({ ...draft, activities: draft.activities.map((row, i) => i === index ? { ...row, role: value } : row) })} /><Field label="기관·유형" value={item.organization} onChange={(value) => setDraft({ ...draft, activities: draft.activities.map((row, i) => i === index ? { ...row, organization: value } : row) })} /><Field label="설명" value={item.description} multiline onChange={(value) => setDraft({ ...draft, activities: draft.activities.map((row, i) => i === index ? { ...row, description: value } : row) })} /></div>)}</>}
        {tab === "projects" && <><h2>프로젝트</h2>{draft.projects.map((item, index) => <div className="editor-card" key={item.id}><h3>{index + 1}. {item.title}</h3><Field label="제목" value={item.title} onChange={(value) => setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, title: value } : row) })} /><Field label="요약" value={item.summary} multiline onChange={(value) => setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, summary: value } : row) })} /><Field label="내가 한 일" value={item.myRole} multiline onChange={(value) => setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, myRole: value } : row) })} /><Field label="한계" value={item.boundary} multiline onChange={(value) => setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, boundary: value } : row) })} /><Field label="이미지 경로 또는 URL" value={item.image} onChange={(value) => setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, image: value } : row) })} /><label className="file-button">프로젝트 사진 선택<input hidden type="file" accept="image/*" onChange={async (event) => { try { const value = await imageData(event); if (value) setDraft({ ...draft, projects: draft.projects.map((row, i) => i === index ? { ...row, image: value } : row) }); } catch (error) { setStatus(String(error)); } }} /></label></div>)}</>}
        {tab === "raw" && <><h2>전체 JSON</h2><p className="editor-note">수정 후 입력창 밖을 클릭하면 문법과 필수 항목을 검사합니다. 오류가 있으면 이전 편집본을 유지합니다.</p><textarea aria-label="전체 포트폴리오 JSON" className="raw-json" key={JSON.stringify(draft).length} defaultValue={JSON.stringify(draft, null, 2)} onBlur={(event) => { try { const next = parsePortfolioContent(JSON.parse(event.target.value)); setDraft(next); setStatus("전체 JSON을 반영했습니다."); } catch (error) { setStatus(`반영하지 못했습니다. ${error instanceof Error ? error.message : "JSON 형식을 확인해주세요."}`); } }} /></>}
        <p className="editor-status" aria-live="polite">{status}</p>
      </section>
    </div>
  </main>;
}
