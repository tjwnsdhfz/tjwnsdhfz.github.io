"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  sanitizePortfolioContent,
  type PortfolioContent,
  type PortfolioProject,
  type RepositoryItem,
} from "../lib/portfolio-content";

export type EditorTab = "basic" | "fit" | "github" | "projects" | "career" | "skills" | "contact" | "publish";
type SaveState = { kind: "idle" | "saving" | "success" | "error"; message: string };

type GitHubPublishSettings = {
  repository: string;
  branch: string;
  filePath: string;
};

const draftStorageKey = "kim-seojun-portfolio-draft-v2-hd-design";
const publishSettingsKey = "kim-seojun-portfolio-github-settings-v2";
const defaultPublishSettings: GitHubPublishSettings = {
  repository: process.env.NEXT_PUBLIC_GITHUB_REPO || "tjwnsdhfz/tjwnsdhfz.github.io",
  branch: "main",
  filePath: "public/portfolio-content.json",
};

const tabs: { id: EditorTab; label: string }[] = [
  { id: "basic", label: "기본·Hero" },
  { id: "fit", label: "직무 적합성" },
  { id: "github", label: "GitHub" },
  { id: "projects", label: "프로젝트" },
  { id: "career", label: "경력·수상" },
  { id: "skills", label: "역량·자격" },
  { id: "contact", label: "연락처" },
  { id: "publish", label: "게시·배포" },
];

function encodeUtf8Base64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 16_384) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 16_384));
  }
  return window.btoa(binary);
}

function githubContentUrl(repository: string, filePath: string): string {
  const encodedRepository = repository.split("/").map(encodeURIComponent).join("/");
  const encodedPath = filePath.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodedRepository}/contents/${encodedPath}`;
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
      <path d="m4 4 12 12M16 4 4 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "password";
  hint?: string;
}) {
  const id = `field-${useId()}`;
  return (
    <label className="editor-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={type === "password" ? "off" : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = `textarea-${useId()}`;
  return (
    <label className="editor-field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="editor-section">
      <div className="editor-section-heading">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="editor-fields">{children}</div>
    </section>
  );
}

function EditorDisclosure({ defaultOpen, children }: { defaultOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      className="project-editor"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      {children}
    </details>
  );
}

function ItemActions({
  index,
  count,
  onMove,
  onDuplicate,
  onDelete,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onDuplicate?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="item-actions">
      <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>위로</button>
      <button type="button" disabled={index === count - 1} onClick={() => onMove(1)}>아래로</button>
      {onDuplicate ? <button type="button" onClick={onDuplicate}>복제</button> : null}
      <button className="danger-link" type="button" onClick={onDelete}>삭제</button>
    </div>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function toLines(items: string[]): string {
  return items.join("\n");
}

function fromLines(value: string): string[] {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function newProject(): PortfolioProject {
  return {
    id: `project-${Date.now()}`,
    category: "NEW · PROJECT",
    title: "새 프로젝트",
    summary: "프로젝트를 한두 문장으로 설명해 주세요.",
    image: "/projects/architecture-gallery.webp",
    imageAlt: "새 프로젝트 대표 이미지",
    tone: "light",
    featured: false,
    visible: true,
    details: [
      { label: "Problem", value: "해결하려 한 문제" },
      { label: "My role", value: "내가 맡은 역할" },
      { label: "Proof", value: "결과를 증명하는 근거" },
    ],
    tags: ["Tool", "Skill"],
    links: [],
  };
}

function newRepository(): RepositoryItem {
  return {
    id: `repository-${Date.now()}`,
    name: "New repository",
    fullName: "owner/repository",
    description: "이 저장소에서 해결한 문제와 구현 범위를 설명해 주세요.",
    repositoryUrl: "https://github.com/",
    demoUrl: "",
    demoLabel: "",
    language: "TypeScript",
    status: "Public",
    tags: ["Project"],
    visible: true,
  };
}

export default function ContentEditor({
  open,
  initialTab,
  content,
  dirty,
  onChange,
  onClose,
  onSaved,
}: {
  open: boolean;
  initialTab: EditorTab;
  content: PortfolioContent;
  dirty: boolean;
  onChange: (content: PortfolioContent) => void;
  onClose: () => void;
  onSaved: (content: PortfolioContent) => void;
}) {
  const [tab, setTab] = useState<EditorTab>(initialTab);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle", message: "" });
  const [autoSaveMessage, setAutoSaveMessage] = useState(
    "브라우저 초안 자동 저장 준비됨 · GitHub에는 자동 게시되지 않습니다.",
  );
  const [publishSettings, setPublishSettings] = useState<GitHubPublishSettings>(defaultPublishSettings);
  const [githubToken, setGithubToken] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const editorBodyRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const onSavedRef = useRef(onSaved);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onSavedRef.current = onSaved;
  }, [onSaved]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dirty) return;
    const timer = window.setTimeout(() => {
      try {
        const sanitized = sanitizePortfolioContent(content);
        window.localStorage.setItem(draftStorageKey, JSON.stringify(sanitized));
        onSavedRef.current(sanitized);
        setSaveState({ kind: "idle", message: "" });
        const savedAt = new Intl.DateTimeFormat("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
        setAutoSaveMessage(`브라우저 초안 자동 저장됨 · ${savedAt} · GitHub 미게시`);
      } catch (error) {
        setSaveState({
          kind: "error",
          message: error instanceof Error ? error.message : "브라우저 초안을 자동 저장하지 못했습니다.",
        });
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [content, dirty, open]);

  const selectTab = (nextTab: EditorTab, trigger?: HTMLElement) => {
    if (nextTab === "publish") {
      try {
        const savedSettings = window.localStorage.getItem(publishSettingsKey);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings) as Partial<GitHubPublishSettings>;
          setPublishSettings({
            repository: typeof parsed.repository === "string" ? parsed.repository : defaultPublishSettings.repository,
            branch: typeof parsed.branch === "string" ? parsed.branch : defaultPublishSettings.branch,
            filePath: typeof parsed.filePath === "string" ? parsed.filePath : defaultPublishSettings.filePath,
          });
        }
      } catch {
        window.localStorage.removeItem(publishSettingsKey);
      }
    }
    setTab(nextTab);
    requestAnimationFrame(() => {
      editorBodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      trigger?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  };

  if (!open) return null;

  const updateIdentity = (key: keyof PortfolioContent["identity"], value: string) => {
    onChange({ ...content, identity: { ...content.identity, [key]: value } });
  };

  const updateHero = <K extends keyof PortfolioContent["hero"]>(key: K, value: PortfolioContent["hero"][K]) => {
    onChange({ ...content, hero: { ...content.hero, [key]: value } });
  };

  const updateProject = (index: number, nextProject: PortfolioProject) => {
    onChange({
      ...content,
      projects: content.projects.map((project, projectIndex) => projectIndex === index ? nextProject : project),
    });
  };

  const updateRepository = (index: number, nextRepository: RepositoryItem) => {
    onChange({
      ...content,
      repositories: content.repositories.map((repository, repositoryIndex) =>
        repositoryIndex === index ? nextRepository : repository,
      ),
    });
  };

  const saveLocalDraft = () => {
    setSaveState({ kind: "saving", message: "이 기기에 저장 중…" });
    try {
      const sanitized = sanitizePortfolioContent(content);
      window.localStorage.setItem(draftStorageKey, JSON.stringify(sanitized));
      onSavedRef.current(sanitized);
      setAutoSaveMessage("브라우저 초안 저장됨 · GitHub에는 자동 게시되지 않습니다.");
      setSaveState({ kind: "success", message: "이 브라우저에 초안을 저장했습니다." });
    } catch (error) {
      setSaveState({
        kind: "error",
        message: error instanceof Error ? error.message : "브라우저 초안을 저장하지 못했습니다.",
      });
    }
  };

  const publishToGitHub = async () => {
    const repository = publishSettings.repository.trim();
    const branch = publishSettings.branch.trim();
    const filePath = publishSettings.filePath.trim().replace(/^\/+/, "");

    if (!/^[^/\s]+\/[^/\s]+$/.test(repository)) {
      setSaveState({ kind: "error", message: "GitHub 저장소를 owner/repository 형식으로 입력해 주세요." });
      return;
    }
    if (!branch || !filePath || !githubToken.trim()) {
      setSaveState({ kind: "error", message: "브랜치, 콘텐츠 경로, GitHub 토큰을 모두 입력해 주세요." });
      return;
    }

    setSaveState({ kind: "saving", message: "GitHub에 게시 중…" });
    try {
      const settings = { repository, branch, filePath };
      window.localStorage.setItem(publishSettingsKey, JSON.stringify(settings));
      const endpoint = githubContentUrl(repository, filePath);
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken.trim()}`,
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const currentResponse = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers });
      let sha: string | undefined;
      if (currentResponse.ok) {
        const current = await currentResponse.json() as { sha?: string };
        sha = current.sha;
      } else if (currentResponse.status !== 404) {
        const currentError = await currentResponse.json().catch(() => ({})) as { message?: string };
        throw new Error(currentError.message || "기존 콘텐츠 파일을 확인하지 못했습니다.");
      }

      const sanitized = sanitizePortfolioContent(content);
      const payload = {
        message: "Update portfolio content",
        content: encodeUtf8Base64(`${JSON.stringify(sanitized, null, 2)}\n`),
        branch,
        ...(sha ? { sha } : {}),
      };
      const publishResponse = await fetch(endpoint, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!publishResponse.ok) {
        const publishError = await publishResponse.json().catch(() => ({})) as { message?: string };
        throw new Error(publishError.message || "GitHub에 게시하지 못했습니다.");
      }

      window.localStorage.setItem(draftStorageKey, JSON.stringify(sanitized));
      onSavedRef.current(sanitized);
      setAutoSaveMessage("브라우저 초안과 GitHub 콘텐츠가 일치합니다.");
      setSaveState({
        kind: "success",
        message: "GitHub에 게시했습니다. 연결된 호스팅이 새 버전을 자동 배포합니다.",
      });
    } catch (error) {
      setSaveState({
        kind: "error",
        message: error instanceof Error ? error.message : "GitHub에 게시하지 못했습니다.",
      });
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kim-seojun-portfolio-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = sanitizePortfolioContent(JSON.parse(await file.text()));
      onChange(imported);
      setSaveState({ kind: "idle", message: "JSON을 불러왔습니다. 저장하면 사이트에 반영됩니다." });
    } catch {
      setSaveState({ kind: "error", message: "올바른 포트폴리오 JSON 파일이 아닙니다." });
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="editor-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside className="content-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <header className="editor-header">
          <div>
            <p>LIVE CONTENT</p>
            <h2 id="editor-title">포트폴리오 편집</h2>
          </div>
          <button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose} aria-label="편집기 닫기">
            <CloseIcon />
          </button>
        </header>

        <div className="editor-toolbar">
          <button type="button" onClick={exportJson}>JSON 내보내기</button>
          <button type="button" onClick={() => importInputRef.current?.click()}>JSON 불러오기</button>
          <input ref={importInputRef} className="visually-hidden" type="file" accept="application/json" onChange={importJson} />
          <button
            type="button"
            onClick={() => {
              if (window.confirm("기본 템플릿 내용으로 되돌릴까요? 저장 전까지는 사이트에 반영되지 않습니다.")) {
                onChange(structuredClone(DEFAULT_PORTFOLIO_CONTENT));
              }
            }}
          >기본값 복원</button>
        </div>

        <label className="editor-tab-select">
          <span>편집 섹션</span>
          <select value={tab} onChange={(event) => selectTab(event.target.value as EditorTab)}>
            {tabs.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>

        <nav className="editor-tabs" aria-label="편집 섹션">
          {tabs.map((item) => (
            <button
              type="button"
              key={item.id}
              className={tab === item.id ? "is-active" : ""}
              onClick={(event) => selectTab(item.id, event.currentTarget)}
              aria-current={tab === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="editor-body" ref={editorBodyRef}>
          {tab === "basic" ? (
            <>
              <FormSection title="기본 정보" description="상단 내비게이션과 연락처에 사용됩니다.">
                <div className="field-grid">
                  <Field label="이름" value={content.identity.name} onChange={(value) => updateIdentity("name", value)} />
                  <Field label="영문 이름" value={content.identity.englishName} onChange={(value) => updateIdentity("englishName", value)} />
                  <Field label="모노그램" value={content.identity.monogram} onChange={(value) => updateIdentity("monogram", value)} />
                  <Field label="현재 상태" value={content.identity.status} onChange={(value) => updateIdentity("status", value)} />
                  <Field label="GitHub 핸들" value={content.identity.githubHandle} onChange={(value) => updateIdentity("githubHandle", value)} />
                </div>
                <Field label="직무 포지셔닝" value={content.identity.role} onChange={(value) => updateIdentity("role", value)} />
              </FormSection>

              <FormSection title="Hero" description="방문자가 처음 보는 핵심 문장과 이미지입니다.">
                <Field label="작은 제목" value={content.hero.eyebrow} onChange={(value) => updateHero("eyebrow", value)} />
                <Field label="메인 문장 1" value={content.hero.title} onChange={(value) => updateHero("title", value)} />
                <Field label="메인 문장 2" value={content.hero.highlight} onChange={(value) => updateHero("highlight", value)} />
                <Textarea label="소개" value={content.hero.description} onChange={(value) => updateHero("description", value)} />
                <div className="field-grid">
                  <Field label="1차 버튼 문구" value={content.hero.primaryCta.label} onChange={(value) => updateHero("primaryCta", { ...content.hero.primaryCta, label: value })} />
                  <Field label="1차 버튼 링크" value={content.hero.primaryCta.href} onChange={(value) => updateHero("primaryCta", { ...content.hero.primaryCta, href: value })} />
                  <Field label="2차 버튼 문구" value={content.hero.secondaryCta.label} onChange={(value) => updateHero("secondaryCta", { ...content.hero.secondaryCta, label: value })} />
                  <Field label="2차 버튼 링크" value={content.hero.secondaryCta.href} onChange={(value) => updateHero("secondaryCta", { ...content.hero.secondaryCta, href: value })} />
                </div>
                <Field label="대표 이미지 경로" value={content.hero.image} onChange={(value) => updateHero("image", value)} hint="/projects/파일명 또는 https:// 이미지 주소" />
                <Field label="이미지 대체 텍스트" value={content.hero.imageAlt} onChange={(value) => updateHero("imageAlt", value)} />
                <Field label="이미지 캡션" value={content.hero.imageCaption} onChange={(value) => updateHero("imageCaption", value)} />
              </FormSection>

              <FormSection title="채용 핵심 정보" description="첫 화면에서 학력·성적·언어처럼 빠르게 확인할 정보를 보여줍니다.">
                {content.careerFacts.map((fact, index) => (
                  <div className="repeater" key={`career-fact-${index}`}>
                    <div className="field-grid">
                      <Field
                        label="항목"
                        value={fact.label}
                        onChange={(value) => onChange({
                          ...content,
                          careerFacts: content.careerFacts.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, label: value } : item,
                          ),
                        })}
                      />
                      <Field
                        label="내용"
                        value={fact.value}
                        onChange={(value) => onChange({
                          ...content,
                          careerFacts: content.careerFacts.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, value } : item,
                          ),
                        })}
                      />
                    </div>
                    <ItemActions
                      index={index}
                      count={content.careerFacts.length}
                      onMove={(direction) => onChange({
                        ...content,
                        careerFacts: moveItem(content.careerFacts, index, direction),
                      })}
                      onDelete={() => onChange({
                        ...content,
                        careerFacts: content.careerFacts.filter((_, itemIndex) => itemIndex !== index),
                      })}
                    />
                  </div>
                ))}
                <button
                  className="add-button"
                  type="button"
                  onClick={() => onChange({
                    ...content,
                    careerFacts: [...content.careerFacts, { label: "Fact", value: "내용" }],
                  })}
                >+ 정보 추가</button>
              </FormSection>

              <FormSection title="프로필 소개">
                <Field label="작은 제목" value={content.intro.eyebrow} onChange={(value) => onChange({ ...content, intro: { ...content.intro, eyebrow: value } })} />
                <Field label="제목" value={content.intro.title} onChange={(value) => onChange({ ...content, intro: { ...content.intro, title: value } })} />
                <Textarea label="설명" value={content.intro.description} onChange={(value) => onChange({ ...content, intro: { ...content.intro, description: value } })} />
              </FormSection>

              <FormSection title="핵심 수치" description="실제 성과와 분석 가정을 구분해서 작성해 주세요.">
                {content.metrics.map((metric, index) => (
                  <div className="repeater" key={`metric-${index}`}>
                    <div className="field-grid">
                      <Field label={`수치 ${index + 1}`} value={metric.value} onChange={(value) => onChange({ ...content, metrics: content.metrics.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) })} />
                      <Field label="설명" value={metric.label} onChange={(value) => onChange({ ...content, metrics: content.metrics.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) })} />
                    </div>
                    <ItemActions index={index} count={content.metrics.length} onMove={(direction) => onChange({ ...content, metrics: moveItem(content.metrics, index, direction) })} onDelete={() => onChange({ ...content, metrics: content.metrics.filter((_, itemIndex) => itemIndex !== index) })} />
                  </div>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, metrics: [...content.metrics, { value: "00+", label: "새 지표" }] })}>+ 수치 추가</button>
              </FormSection>
            </>
          ) : null}

          {tab === "fit" ? (
            <>
              <FormSection title="직무 적합성 섹션" description="회사·직무가 바뀌면 이 제목과 설명부터 교체하세요.">
                <Field label="작은 제목" value={content.roleFitIntro.eyebrow} onChange={(value) => onChange({ ...content, roleFitIntro: { ...content.roleFitIntro, eyebrow: value } })} />
                <Field label="제목" value={content.roleFitIntro.title} onChange={(value) => onChange({ ...content, roleFitIntro: { ...content.roleFitIntro, title: value } })} />
                <Textarea label="설명" value={content.roleFitIntro.description} onChange={(value) => onChange({ ...content, roleFitIntro: { ...content.roleFitIntro, description: value } })} />
              </FormSection>
              <FormSection title="직무-근거 매핑" description="직무 요구, 실제 근거, 전이 가능한 이유를 한 카드에 묶습니다.">
                {content.roleFit.map((item, index) => (
                  <div className="repeater" key={`role-fit-${index}`}>
                    <div className="field-grid">
                      <Field label="번호·분류" value={item.label} onChange={(value) => onChange({ ...content, roleFit: content.roleFit.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: value } : entry) })} />
                      <Field label="업무 신호" value={item.title} onChange={(value) => onChange({ ...content, roleFit: content.roleFit.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: value } : entry) })} />
                    </div>
                    <Textarea label="확인 가능한 근거" value={item.evidence} onChange={(value) => onChange({ ...content, roleFit: content.roleFit.map((entry, itemIndex) => itemIndex === index ? { ...entry, evidence: value } : entry) })} />
                    <Textarea label="지원 직무 연결" value={item.application} onChange={(value) => onChange({ ...content, roleFit: content.roleFit.map((entry, itemIndex) => itemIndex === index ? { ...entry, application: value } : entry) })} />
                    <ItemActions
                      index={index}
                      count={content.roleFit.length}
                      onMove={(direction) => onChange({ ...content, roleFit: moveItem(content.roleFit, index, direction) })}
                      onDelete={() => onChange({ ...content, roleFit: content.roleFit.filter((_, itemIndex) => itemIndex !== index) })}
                    />
                  </div>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, roleFit: [...content.roleFit, { label: "0X · ROLE FIT", title: "새 업무 신호", evidence: "확인 가능한 경험과 산출물", application: "지원 직무와 연결되는 이유" }] })}>+ 직무 근거 추가</button>
              </FormSection>
              <FormSection title="과장 방지 경계" description="아직 경험하지 않은 실무·도구·인증을 명확히 분리합니다.">
                <Textarea label="경계 문구" value={content.roleBoundary} rows={5} onChange={(value) => onChange({ ...content, roleBoundary: value })} />
              </FormSection>
            </>
          ) : null}

          {tab === "github" ? (
            <>
              <FormSection title="GitHub 섹션" description="실제로 공개된 대표 저장소만 선별해 보여주세요.">
                <Field label="작은 제목" value={content.repositoryIntro.eyebrow} onChange={(value) => onChange({ ...content, repositoryIntro: { ...content.repositoryIntro, eyebrow: value } })} />
                <Field label="제목" value={content.repositoryIntro.title} onChange={(value) => onChange({ ...content, repositoryIntro: { ...content.repositoryIntro, title: value } })} />
                <Textarea label="설명" value={content.repositoryIntro.description} onChange={(value) => onChange({ ...content, repositoryIntro: { ...content.repositoryIntro, description: value } })} />
                <Field label="프로필 링크 문구" value={content.repositoryIntro.profileLabel} onChange={(value) => onChange({ ...content, repositoryIntro: { ...content.repositoryIntro, profileLabel: value } })} />
              </FormSection>

              <FormSection title="Pinned repositories" description="저장소 순서, 노출 여부, 기술과 링크를 직접 편집할 수 있습니다.">
                {content.repositories.map((repository, index) => (
                  <EditorDisclosure key={repository.id} defaultOpen={index === 0}>
                    <summary>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{repository.fullName}</strong>
                      <i>{repository.visible ? "노출" : "숨김"}</i>
                    </summary>
                    <div className="project-editor-body">
                      <ItemActions
                        index={index}
                        count={content.repositories.length}
                        onMove={(direction) => onChange({ ...content, repositories: moveItem(content.repositories, index, direction) })}
                        onDuplicate={() => {
                          const duplicate = structuredClone(repository);
                          duplicate.id = `repository-${Date.now()}`;
                          duplicate.name = `${repository.name} 복사본`;
                          const nextRepositories = [...content.repositories];
                          nextRepositories.splice(index + 1, 0, duplicate);
                          onChange({ ...content, repositories: nextRepositories });
                        }}
                        onDelete={() => {
                          if (window.confirm(`'${repository.name}' 저장소 카드를 삭제할까요?`)) {
                            onChange({ ...content, repositories: content.repositories.filter((_, itemIndex) => itemIndex !== index) });
                          }
                        }}
                      />
                      <div className="check-row">
                        <label><input type="checkbox" checked={repository.visible} onChange={(event) => updateRepository(index, { ...repository, visible: event.target.checked })} /> 사이트에 노출</label>
                      </div>
                      <div className="field-grid">
                        <Field label="표시 이름" value={repository.name} onChange={(value) => updateRepository(index, { ...repository, name: value })} />
                        <Field label="owner/repository" value={repository.fullName} onChange={(value) => updateRepository(index, { ...repository, fullName: value })} />
                        <Field label="상태" value={repository.status} onChange={(value) => updateRepository(index, { ...repository, status: value })} />
                        <Field label="주요 언어" value={repository.language} onChange={(value) => updateRepository(index, { ...repository, language: value })} />
                      </div>
                      <Textarea label="저장소 설명" value={repository.description} onChange={(value) => updateRepository(index, { ...repository, description: value })} />
                      <Field label="GitHub 주소" type="url" value={repository.repositoryUrl} onChange={(value) => updateRepository(index, { ...repository, repositoryUrl: value })} />
                      <div className="field-grid">
                        <Field label="데모 주소" type="url" value={repository.demoUrl} onChange={(value) => updateRepository(index, { ...repository, demoUrl: value })} hint="데모가 없으면 비워 두세요." />
                        <Field label="데모 링크 문구" value={repository.demoLabel} onChange={(value) => updateRepository(index, { ...repository, demoLabel: value })} />
                      </div>
                      <Textarea label="기술 태그" value={toLines(repository.tags)} rows={5} onChange={(value) => updateRepository(index, { ...repository, tags: fromLines(value) })} hint="한 줄에 하나씩 입력" />
                    </div>
                  </EditorDisclosure>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, repositories: [...content.repositories, newRepository()] })}>+ 저장소 추가</button>
              </FormSection>
            </>
          ) : null}

          {tab === "projects" ? (
            <>
              <FormSection title="프로젝트 섹션 제목" description="지원 회사·직무가 바뀌면 대표 작업을 소개하는 문구도 함께 바꾸세요.">
                <Field label="대표 작업 작은 제목" value={content.projectIntro.eyebrow} onChange={(value) => onChange({ ...content, projectIntro: { ...content.projectIntro, eyebrow: value } })} />
                <Field label="대표 작업 제목" value={content.projectIntro.title} onChange={(value) => onChange({ ...content, projectIntro: { ...content.projectIntro, title: value } })} />
                <Textarea label="대표 작업 설명" value={content.projectIntro.description} onChange={(value) => onChange({ ...content, projectIntro: { ...content.projectIntro, description: value } })} />
                <div className="field-grid">
                  <Field label="보조 작업 작은 제목" value={content.projectIntro.supportingEyebrow} onChange={(value) => onChange({ ...content, projectIntro: { ...content.projectIntro, supportingEyebrow: value } })} />
                  <Field label="보조 작업 제목" value={content.projectIntro.supportingTitle} onChange={(value) => onChange({ ...content, projectIntro: { ...content.projectIntro, supportingTitle: value } })} />
                </div>
              </FormSection>
              <FormSection title="프로젝트" description="대표 프로젝트는 큰 전체폭 타일로, 나머지는 2열 작업 목록으로 표시됩니다.">
              {content.projects.map((project, index) => (
                <EditorDisclosure key={project.id} defaultOpen={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{project.title}</strong>
                    <i>{project.visible ? (project.featured ? "대표" : "노출") : "숨김"}</i>
                  </summary>
                  <div className="project-editor-body">
                    <ItemActions
                      index={index}
                      count={content.projects.length}
                      onMove={(direction) => onChange({ ...content, projects: moveItem(content.projects, index, direction) })}
                      onDuplicate={() => {
                        const duplicate = structuredClone(project);
                        duplicate.id = `project-${Date.now()}`;
                        duplicate.title = `${project.title} 복사본`;
                        const nextProjects = [...content.projects];
                        nextProjects.splice(index + 1, 0, duplicate);
                        onChange({ ...content, projects: nextProjects });
                      }}
                      onDelete={() => {
                        if (window.confirm(`'${project.title}' 프로젝트를 삭제할까요?`)) {
                          onChange({ ...content, projects: content.projects.filter((_, itemIndex) => itemIndex !== index) });
                        }
                      }}
                    />
                    <div className="check-row">
                      <label><input type="checkbox" checked={project.visible} onChange={(event) => updateProject(index, { ...project, visible: event.target.checked })} /> 사이트에 노출</label>
                      <label><input type="checkbox" checked={project.featured} onChange={(event) => updateProject(index, { ...project, featured: event.target.checked })} /> 대표 타일</label>
                      <label>
                        명암
                        <select value={project.tone} onChange={(event) => updateProject(index, { ...project, tone: event.target.value === "dark" ? "dark" : "light" })}>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </label>
                    </div>
                    <Field label="분류" value={project.category} onChange={(value) => updateProject(index, { ...project, category: value })} />
                    <Field label="프로젝트명" value={project.title} onChange={(value) => updateProject(index, { ...project, title: value })} />
                    <Textarea label="한 줄 설명" value={project.summary} onChange={(value) => updateProject(index, { ...project, summary: value })} />
                    <Field label="이미지 경로" value={project.image} onChange={(value) => updateProject(index, { ...project, image: value })} hint="/projects/파일명 또는 https:// 이미지 주소" />
                    <Field label="이미지 대체 텍스트" value={project.imageAlt} onChange={(value) => updateProject(index, { ...project, imageAlt: value })} />

                    <div className="nested-heading"><h4>문제·역할·증거</h4><button type="button" onClick={() => updateProject(index, { ...project, details: [...project.details, { label: "Detail", value: "설명" }] })}>+ 추가</button></div>
                    {project.details.map((detail, detailIndex) => (
                      <div className="nested-row" key={`detail-${detailIndex}`}>
                        <Field label="항목" value={detail.label} onChange={(value) => updateProject(index, { ...project, details: project.details.map((item, itemIndex) => itemIndex === detailIndex ? { ...item, label: value } : item) })} />
                        <Textarea label="내용" value={detail.value} rows={3} onChange={(value) => updateProject(index, { ...project, details: project.details.map((item, itemIndex) => itemIndex === detailIndex ? { ...item, value } : item) })} />
                        <button className="danger-link" type="button" onClick={() => updateProject(index, { ...project, details: project.details.filter((_, itemIndex) => itemIndex !== detailIndex) })}>항목 삭제</button>
                      </div>
                    ))}

                    <Textarea label="태그" value={toLines(project.tags)} rows={4} onChange={(value) => updateProject(index, { ...project, tags: fromLines(value) })} hint="한 줄에 하나씩 입력" />

                    <div className="nested-heading"><h4>외부 링크</h4><button type="button" onClick={() => updateProject(index, { ...project, links: [...project.links, { label: "Link", href: "https://" }] })}>+ 추가</button></div>
                    {project.links.map((item, linkIndex) => (
                      <div className="nested-row link-row" key={`link-${linkIndex}`}>
                        <Field label="링크 문구" value={item.label} onChange={(value) => updateProject(index, { ...project, links: project.links.map((linkItem, itemIndex) => itemIndex === linkIndex ? { ...linkItem, label: value } : linkItem) })} />
                        <Field label="주소" value={item.href} onChange={(value) => updateProject(index, { ...project, links: project.links.map((linkItem, itemIndex) => itemIndex === linkIndex ? { ...linkItem, href: value } : linkItem) })} />
                        <button className="danger-link" type="button" onClick={() => updateProject(index, { ...project, links: project.links.filter((_, itemIndex) => itemIndex !== linkIndex) })}>링크 삭제</button>
                      </div>
                    ))}
                  </div>
                </EditorDisclosure>
              ))}
              <button className="add-button" type="button" onClick={() => onChange({ ...content, projects: [...content.projects, newProject()] })}>+ 프로젝트 추가</button>
              </FormSection>
            </>
          ) : null}

          {tab === "career" ? (
            <>
              <FormSection title="경력 섹션 제목">
                <Field label="작은 제목" value={content.experienceIntro.eyebrow} onChange={(value) => onChange({ ...content, experienceIntro: { ...content.experienceIntro, eyebrow: value } })} />
                <Field label="제목" value={content.experienceIntro.title} onChange={(value) => onChange({ ...content, experienceIntro: { ...content.experienceIntro, title: value } })} />
                <Textarea label="설명" value={content.experienceIntro.description} onChange={(value) => onChange({ ...content, experienceIntro: { ...content.experienceIntro, description: value } })} />
              </FormSection>
              <FormSection title="경력">
                {content.experiences.map((item, index) => (
                  <div className="repeater" key={`experience-${index}`}>
                    <Field label="기간" value={item.period} onChange={(value) => onChange({ ...content, experiences: content.experiences.map((entry, itemIndex) => itemIndex === index ? { ...entry, period: value } : entry) })} />
                    <Field label="역할·기관" value={item.role} onChange={(value) => onChange({ ...content, experiences: content.experiences.map((entry, itemIndex) => itemIndex === index ? { ...entry, role: value } : entry) })} />
                    <Textarea label="설명" value={item.description} onChange={(value) => onChange({ ...content, experiences: content.experiences.map((entry, itemIndex) => itemIndex === index ? { ...entry, description: value } : entry) })} />
                    <ItemActions index={index} count={content.experiences.length} onMove={(direction) => onChange({ ...content, experiences: moveItem(content.experiences, index, direction) })} onDelete={() => onChange({ ...content, experiences: content.experiences.filter((_, itemIndex) => itemIndex !== index) })} />
                  </div>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, experiences: [...content.experiences, { period: "20XX — NOW", role: "새 경험", description: "담당 업무와 결과" }] })}>+ 경력 추가</button>
              </FormSection>
              <FormSection title="수상·리더십">
                {content.awards.map((award, index) => (
                  <div className="repeater" key={`award-${index}`}>
                    <div className="field-grid">
                      <Field label="연도" value={award.year} onChange={(value) => onChange({ ...content, awards: content.awards.map((item, itemIndex) => itemIndex === index ? { ...item, year: value } : item) })} />
                      <Field label="내용" value={award.title} onChange={(value) => onChange({ ...content, awards: content.awards.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) })} />
                    </div>
                    <ItemActions index={index} count={content.awards.length} onMove={(direction) => onChange({ ...content, awards: moveItem(content.awards, index, direction) })} onDelete={() => onChange({ ...content, awards: content.awards.filter((_, itemIndex) => itemIndex !== index) })} />
                  </div>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, awards: [...content.awards, { year: "20XX", title: "새 수상·리더십" }] })}>+ 항목 추가</button>
              </FormSection>
            </>
          ) : null}

          {tab === "skills" ? (
            <>
              <FormSection title="역량 섹션 제목">
                <Field label="작은 제목" value={content.capabilityIntro.eyebrow} onChange={(value) => onChange({ ...content, capabilityIntro: { ...content.capabilityIntro, eyebrow: value } })} />
                <Field label="제목" value={content.capabilityIntro.title} onChange={(value) => onChange({ ...content, capabilityIntro: { ...content.capabilityIntro, title: value } })} />
                <Textarea label="설명" value={content.capabilityIntro.description} onChange={(value) => onChange({ ...content, capabilityIntro: { ...content.capabilityIntro, description: value } })} />
              </FormSection>
              <FormSection title="역량 묶음">
                {content.capabilities.map((capability, index) => (
                  <div className="repeater" key={`capability-${index}`}>
                    <Field label="역량 이름" value={capability.title} onChange={(value) => onChange({ ...content, capabilities: content.capabilities.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) })} />
                    <Field label="한 줄 설명" value={capability.summary} onChange={(value) => onChange({ ...content, capabilities: content.capabilities.map((item, itemIndex) => itemIndex === index ? { ...item, summary: value } : item) })} />
                    <Textarea label="세부 항목" value={toLines(capability.items)} onChange={(value) => onChange({ ...content, capabilities: content.capabilities.map((item, itemIndex) => itemIndex === index ? { ...item, items: fromLines(value) } : item) })} hint="한 줄에 하나씩 입력" />
                    <ItemActions index={index} count={content.capabilities.length} onMove={(direction) => onChange({ ...content, capabilities: moveItem(content.capabilities, index, direction) })} onDelete={() => onChange({ ...content, capabilities: content.capabilities.filter((_, itemIndex) => itemIndex !== index) })} />
                  </div>
                ))}
                <button className="add-button" type="button" onClick={() => onChange({ ...content, capabilities: [...content.capabilities, { title: "새 역량", summary: "한 줄 설명", items: ["세부 항목"] }] })}>+ 역량 추가</button>
              </FormSection>
              <FormSection title="자격·언어">
                <Textarea label="자격 항목" value={toLines(content.credentials)} rows={7} onChange={(value) => onChange({ ...content, credentials: fromLines(value) })} hint="한 줄에 하나씩 입력" />
              </FormSection>
            </>
          ) : null}

          {tab === "contact" ? (
            <>
              <FormSection title="연락처">
                <Field label="공개 이메일" type="email" value={content.identity.email} onChange={(value) => updateIdentity("email", value)} />
                <Field label="GitHub 주소" type="url" value={content.identity.github} onChange={(value) => updateIdentity("github", value)} />
              </FormSection>
              <FormSection title="마지막 CTA">
                <Field label="작은 제목" value={content.contact.eyebrow} onChange={(value) => onChange({ ...content, contact: { ...content.contact, eyebrow: value } })} />
                <Field label="제목" value={content.contact.title} onChange={(value) => onChange({ ...content, contact: { ...content.contact, title: value } })} />
                <Textarea label="설명" value={content.contact.description} onChange={(value) => onChange({ ...content, contact: { ...content.contact, description: value } })} />
                <Field label="이메일 버튼 문구" value={content.contact.emailLabel} onChange={(value) => onChange({ ...content, contact: { ...content.contact, emailLabel: value } })} />
                <Field label="푸터 문구" value={content.contact.footerNote} onChange={(value) => onChange({ ...content, contact: { ...content.contact, footerNote: value } })} />
              </FormSection>
            </>
          ) : null}

          {tab === "publish" ? (
            <>
              <FormSection
                title="외부 사이트에 게시"
                description="GitHub 저장소에 콘텐츠 JSON을 반영하면 Vercel, Netlify, Cloudflare Pages, GitHub Pages가 같은 소스로 다시 배포할 수 있습니다."
              >
                <Field
                  label="GitHub 저장소"
                  value={publishSettings.repository}
                  onChange={(repository) => setPublishSettings((current) => ({ ...current, repository }))}
                  hint="owner/repository 형식"
                />
                <div className="field-grid">
                  <Field
                    label="브랜치"
                    value={publishSettings.branch}
                    onChange={(branch) => setPublishSettings((current) => ({ ...current, branch }))}
                  />
                  <Field
                    label="콘텐츠 파일 경로"
                    value={publishSettings.filePath}
                    onChange={(filePath) => setPublishSettings((current) => ({ ...current, filePath }))}
                  />
                </div>
                <Field
                  label="GitHub fine-grained token"
                  type="password"
                  value={githubToken}
                  onChange={setGithubToken}
                  hint="선택한 저장소의 Contents: Read and write 권한만 부여하세요. 토큰은 저장되지 않습니다."
                />
                <div className="publish-notice">
                  <strong>게시 전에 확인</strong>
                  <ul>
                    <li>저장소가 외부 호스팅과 연결되어 있어야 자동 재배포됩니다.</li>
                    <li>토큰은 현재 탭의 메모리에만 머물고 새로고침하면 사라집니다.</li>
                    <li>공개 전에는 JSON 내보내기로 별도 백업을 권장합니다.</li>
                  </ul>
                </div>
                <button
                  className="publish-button"
                  type="button"
                  onClick={() => void publishToGitHub()}
                  disabled={saveState.kind === "saving"}
                >
                  {saveState.kind === "saving" ? "게시 중…" : "GitHub에 게시"}
                </button>
              </FormSection>

              <FormSection
                title="호스팅 연결 정보"
                description="이 프로젝트에는 각 서비스용 빌드 설정이 포함되어 있습니다."
              >
                <dl className="deploy-targets">
                  <div><dt>Vercel</dt><dd>저장소 연결 후 자동 감지</dd></div>
                  <div><dt>Netlify</dt><dd>netlify.toml 사용</dd></div>
                  <div><dt>Cloudflare Pages</dt><dd>빌드 npm run build:portable · 출력 out</dd></div>
                  <div><dt>GitHub Pages</dt><dd>포함된 Actions 워크플로 사용</dd></div>
                </dl>
              </FormSection>
            </>
          ) : null}
        </div>

        <footer className="editor-savebar">
          <p className={`save-message is-${saveState.kind}`} aria-live="polite">
            {saveState.kind === "error"
              ? saveState.message
              : dirty
                ? "변경사항을 브라우저 초안에 자동 저장하는 중…"
                : saveState.message || autoSaveMessage}
          </p>
          <button className="save-button" type="button" onClick={saveLocalDraft} disabled={!dirty || saveState.kind === "saving"}>
            {saveState.kind === "saving" ? "저장 중…" : "지금 저장"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
