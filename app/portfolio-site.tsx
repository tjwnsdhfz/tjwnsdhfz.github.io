"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PORTFOLIO_DRAFT_STORAGE_KEY,
  sanitizePortfolioContent,
  type PortfolioContent,
  type PortfolioProject,
  type RepositoryItem,
} from "../lib/portfolio-content";
import ContentEditor, { type EditorTab } from "./content-editor";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const primaryNavigation = [
  { id: "selected-work", label: "대표 작업" },
  { id: "role-fit", label: "핵심 역량" },
  { id: "experience", label: "경험" },
  { id: "repositories", label: "GitHub" },
  { id: "contact", label: "연락" },
] as const;

function portablePath(value: string): string {
  if (value.startsWith("/") && !value.startsWith("//")) return `${basePath}${value}`;
  return value;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17">
      <path d="m13.9 3.1 3 3L7.2 15.8l-4 .9.9-4L13.9 3.1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
      {open ? (
        <path d="m4 4 12 12M16 4 4 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      ) : (
        <path d="M3 6h14M3 10h14M3 14h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      )}
    </svg>
  );
}

function SectionEditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="section-edit-trigger" type="button" onClick={onClick}>
      <EditIcon />
      <span>{label}</span>
    </button>
  );
}

function SmartLink({ href, label, className = "text-link" }: { href: string; label: string; className?: string }) {
  const external = href.startsWith("http");
  const resolvedHref = portablePath(href);
  return (
    <a className={className} href={resolvedHref} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      <span>{label}</span>
      {external ? <span className="visually-hidden">새 탭에서 열림</span> : null}
      <ArrowIcon />
    </a>
  );
}

function ProjectDetails({ project }: { project: PortfolioProject }) {
  if (!project.details.length) return null;
  return (
    <dl className={`project-details details-count-${project.details.length}`}>
      {project.details.map((detail, index) => {
        const normalizedLabel = detail.label.toLowerCase();
        const emphasisClass = /verified|proof|검증/.test(normalizedLabel)
          ? "is-proof"
          : /boundary|limit|한계/.test(normalizedLabel)
            ? "is-boundary"
            : "";
        return (
          <div className={emphasisClass} key={`${detail.label}-${index}`}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function RepositoryCard({ repository }: { repository: RepositoryItem }) {
  return (
    <article className="repository-card">
      <div className="repository-card-top">
        <div>
          <p className="repository-full-name">{repository.fullName}</p>
          <h3>{repository.name}</h3>
        </div>
        <span className="repository-status">{repository.status}</span>
      </div>
      <p className="repository-description">{repository.description}</p>
      <div className="repository-meta">
        <div className="repository-language">
          <i aria-hidden="true" />
          <span>{repository.language}</span>
        </div>
        <div className="tag-row" aria-label={`${repository.name} 기술`}>
          {repository.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="repository-links">
        <SmartLink href={repository.repositoryUrl} label="Source" />
        {repository.demoUrl && repository.demoLabel
          ? <SmartLink href={repository.demoUrl} label={repository.demoLabel} />
          : null}
      </div>
    </article>
  );
}

export default function PortfolioSite({
  initialContent,
  canEdit,
  initialEditorOpen = false,
}: {
  initialContent: PortfolioContent;
  canEdit: boolean;
  initialEditorOpen?: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [editorOpen, setEditorOpen] = useState(initialEditorOpen);
  const [editorTab, setEditorTab] = useState<EditorTab>("basic");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canEdit) return;
    const frame = window.requestAnimationFrame(() => {
      try {
        const draft = window.localStorage.getItem(PORTFOLIO_DRAFT_STORAGE_KEY);
        if (!draft) return;
        const nextContent = sanitizePortfolioContent(JSON.parse(draft));
        setContent(nextContent);
        setSavedContent(nextContent);
      } catch {
        window.localStorage.removeItem(PORTFOLIO_DRAFT_STORAGE_KEY);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [canEdit, initialContent]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const navigationLinks = Array.from(mobileNavigationRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    requestAnimationFrame(() => navigationLinks[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        requestAnimationFrame(() => mobileMenuTriggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !navigationLinks.length) return;

      const first = navigationLinks[0];
      const last = navigationLinks[navigationLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    let animationFrame = 0;
    const updateActiveSection = () => {
      let nextSection = "top";
      let closestTop = Number.NEGATIVE_INFINITY;
      for (const item of primaryNavigation) {
        const section = document.getElementById(item.id);
        const sectionTop = section?.getBoundingClientRect().top;
        if (typeof sectionTop === "number" && sectionTop <= 150 && sectionTop > closestTop) {
          closestTop = sectionTop;
          nextSection = item.id;
        }
      }
      setActiveSection((current) => current === nextSection ? current : nextSection);
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent],
  );

  useEffect(() => {
    if (!canEdit || !dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [canEdit, dirty]);

  const visibleProjects = content.projects.filter((project) => project.visible);
  const visibleRepositories = content.repositories.filter((repository) => repository.visible);
  const featuredProjects = visibleProjects.filter((project) => project.featured);
  const supportingProjects = visibleProjects.filter((project) => !project.featured);

  const requestCloseEditor = () => {
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 편집을 종료할까요?")) return;
    setEditorOpen(false);
  };

  const openEditor = (tab: EditorTab) => {
    setEditorTab(tab);
    setEditorOpen(true);
  };

  const finishMobileNavigation = (sectionId: string) => {
    if (!mobileNavOpen) return;
    setMobileNavOpen(false);
    requestAnimationFrame(() => document.getElementById(sectionId)?.focus({ preventScroll: true }));
  };

  return (
    <>
      <a className="skip-link" href="#main-content">본문 바로가기</a>

      <header className="global-nav">
        <div className="nav-inner">
          <a
            className="monogram"
            href="#top"
            aria-label={`${content.identity.name} 포트폴리오 홈`}
            aria-current={activeSection === "top" ? "location" : undefined}
          >
            {content.identity.monogram}
          </a>
          <button
            ref={mobileMenuTriggerRef}
            className="mobile-menu-trigger"
            type="button"
            aria-label={mobileNavOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileNavOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <MenuIcon open={mobileNavOpen} />
          </button>
          <nav
            ref={mobileNavigationRef}
            id="primary-navigation"
            className={mobileNavOpen ? "is-open" : ""}
            aria-label="주요 메뉴"
          >
            {primaryNavigation.map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={() => finishMobileNavigation(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="portfolio-nav">
        <div className="nav-inner">
          <a className="portfolio-title" href="#top">
            <strong>{content.identity.name}</strong>
            <span>{content.identity.role}</span>
          </a>
          <div className="portfolio-actions">
            <span className="availability"><i />{content.identity.status}</span>
            {canEdit ? (
              <button className="edit-trigger" type="button" onClick={() => openEditor("basic")}>
                <EditIcon />
                <span>내용 편집</span>
                {dirty ? (
                  <>
                    <i aria-hidden="true" />
                    <span className="visually-hidden" aria-live="polite">브라우저 초안 저장 대기 중</span>
                  </>
                ) : null}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy shell">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="hero-title">
              <span>{content.hero.title}</span>
              <strong>{content.hero.highlight}</strong>
            </h1>
            <p className="hero-description">{content.hero.description}</p>
            <div className="hero-actions">
              <SmartLink href={content.hero.primaryCta.href} label={content.hero.primaryCta.label} className="pill-link primary-pill" />
              <SmartLink href={content.hero.secondaryCta.href} label={content.hero.secondaryCta.label} className="pill-link secondary-pill" />
            </div>
            <dl className="career-facts" aria-label="지원자 핵심 정보">
              {content.careerFacts.map((fact, index) => (
                <div key={`${fact.label}-${index}`}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="hero-visual shell">
            <div className="hero-image-frame">
              {/* User-editable image URLs are rendered directly to keep the template portable. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={portablePath(content.hero.image)} alt={content.hero.imageAlt} fetchPriority="high" />
            </div>
            <figcaption>{content.hero.imageCaption}</figcaption>
          </figure>
        </section>

        <section className="profile-section" id="about" aria-labelledby="profile-title">
          <div className="profile-layout shell">
            <div>
              <p className="eyebrow">{content.intro.eyebrow}</p>
              <h2 id="profile-title">{content.intro.title}</h2>
              {canEdit ? <SectionEditButton label="소개 편집" onClick={() => openEditor("basic")} /> : null}
            </div>
            <p>{content.intro.description}</p>
          </div>
          <dl className="metrics shell">
            {content.metrics.map((metric, index) => (
              <div key={`${metric.label}-${index}`}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="role-fit-section" id="role-fit" aria-labelledby="role-fit-title" tabIndex={-1}>
          <div className="role-fit-heading shell">
            <div>
              <p className="eyebrow">{content.roleFitIntro.eyebrow}</p>
              <h2 id="role-fit-title">{content.roleFitIntro.title}</h2>
              {canEdit ? <SectionEditButton label="핵심 역량 편집" onClick={() => openEditor("fit")} /> : null}
            </div>
            <p>{content.roleFitIntro.description}</p>
          </div>
          <div className="role-fit-grid shell">
            {content.roleFit.map((item, index) => (
              <article key={`${item.label}-${index}`}>
                <div className="role-fit-capability">
                  <p className="role-fit-label">{item.label}</p>
                  <h3>{item.title}</h3>
                </div>
                <div className="role-fit-evidence">
                  <span>확인 가능한 근거</span>
                  <p>{item.evidence}</p>
                  <SmartLink href={item.evidenceHref} label={item.evidenceLabel} className="role-fit-proof-link" />
                </div>
                <div className="role-fit-application">
                  <span>업무 적용 방식</span>
                  <p>{item.application}</p>
                </div>
              </article>
            ))}
          </div>
          <aside className="role-boundary shell" aria-label="경험 범위와 학습 영역">
            <span>HONEST BOUNDARY</span>
            <p>{content.roleBoundary}</p>
          </aside>
        </section>

        <section className="work-index shell" id="selected-work" aria-labelledby="work-title" tabIndex={-1}>
          <p className="eyebrow">{content.projectIntro.eyebrow}</p>
          <h2 id="work-title">{content.projectIntro.title}</h2>
          <p>{content.projectIntro.description}</p>
          {canEdit ? <SectionEditButton label="프로젝트 편집" onClick={() => openEditor("projects")} /> : null}
        </section>

        {featuredProjects.map((project) => (
          <section className={`featured-project tone-${project.tone}`} key={project.id} id={project.id} tabIndex={-1}>
            <div className="featured-copy shell">
              <p className="project-category">{project.category}</p>
              <h2>{project.title}</h2>
              <p className="project-summary">{project.summary}</p>
              <ProjectDetails project={project} />
              <div className="project-footer">
                <div className="tag-row" aria-label={`${project.title} 기술과 주제`}>
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="project-links">
                  {project.links.map((item) => <SmartLink key={`${item.label}-${item.href}`} href={item.href} label={item.label} />)}
                </div>
              </div>
            </div>
            <figure className="project-visual shell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={portablePath(project.image)} alt={project.imageAlt} loading="lazy" />
            </figure>
          </section>
        ))}

        {supportingProjects.length ? (
          <section className="more-work" aria-labelledby="more-work-title">
            <div className="more-work-heading shell">
              <p className="eyebrow">{content.projectIntro.supportingEyebrow}</p>
              <h2 id="more-work-title">{content.projectIntro.supportingTitle}</h2>
            </div>
            <div className="project-grid">
              {supportingProjects.map((project) => (
                <article className={`compact-project tone-${project.tone}`} key={project.id} id={project.id} tabIndex={-1}>
                  <div className="compact-copy">
                    <p className="project-category">{project.category}</p>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    {project.details.length ? (
                      <dl className="compact-details">
                        {project.details.slice(0, 2).map((detail, detailIndex) => (
                          <div key={`${detail.label}-${detailIndex}`}>
                            <dt>{detail.label}</dt>
                            <dd>{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <div className="tag-row">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    {project.links.map((item) => <SmartLink key={`${item.label}-${item.href}`} href={item.href} label={item.label} />)}
                  </div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={portablePath(project.image)} alt={project.imageAlt} loading="lazy" />
                  </figure>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="experience-section" id="experience" aria-labelledby="experience-title" tabIndex={-1}>
          <div className="section-intro shell">
            <p className="eyebrow">{content.experienceIntro.eyebrow}</p>
            <h2 id="experience-title">{content.experienceIntro.title}</h2>
            <p>{content.experienceIntro.description}</p>
            {canEdit ? <SectionEditButton label="경력 편집" onClick={() => openEditor("career")} /> : null}
          </div>
          <ol className="timeline shell">
            {content.experiences.map((item, index) => (
              <li key={`${item.period}-${index}`}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="awards shell">
            {content.awards.map((award, index) => (
              <div key={`${award.title}-${index}`}>
                <span>{award.year}</span>
                <strong>{award.title}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="repository-section" id="repositories" aria-labelledby="repositories-title" tabIndex={-1}>
          <div className="repository-heading shell">
            <div>
              <p className="eyebrow">{content.repositoryIntro.eyebrow}</p>
              <h2 id="repositories-title">{content.repositoryIntro.title}</h2>
              {canEdit ? <SectionEditButton label="GitHub 편집" onClick={() => openEditor("github")} /> : null}
            </div>
            <div className="repository-heading-copy">
              <p>{content.repositoryIntro.description}</p>
              <SmartLink href={content.identity.github} label={content.repositoryIntro.profileLabel} />
            </div>
          </div>
          <div className={`repository-grid shell${visibleRepositories.length === 1 ? " is-single" : ""}`}>
            {visibleRepositories.map((repository) => (
              <RepositoryCard repository={repository} key={repository.id} />
            ))}
          </div>
        </section>

        <section className="capability-section" id="capabilities" aria-labelledby="capability-title">
          <div className="section-intro shell">
            <p className="eyebrow">{content.capabilityIntro.eyebrow}</p>
            <h2 id="capability-title">{content.capabilityIntro.title}</h2>
            <p>{content.capabilityIntro.description}</p>
            {canEdit ? <SectionEditButton label="기술 편집" onClick={() => openEditor("skills")} /> : null}
          </div>
          <div className="capability-grid shell">
            {content.capabilities.map((capability, index) => (
              <article key={`${capability.title}-${index}`}>
                <span>0{index + 1}</span>
                <h3>{capability.title}</h3>
                <p>{capability.summary}</p>
                <ul>
                  {capability.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <div className="credentials shell" aria-label="자격과 언어">
            {content.credentials.map((credential) => <span key={credential}>{credential}</span>)}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
          <div className="contact-inner shell">
            <p className="eyebrow">{content.contact.eyebrow}</p>
            <h2 id="contact-title">{content.contact.title}</h2>
            <p>{content.contact.description}</p>
            {canEdit ? <SectionEditButton label="연락처 편집" onClick={() => openEditor("contact")} /> : null}
            <div className="contact-actions">
              <SmartLink href={`mailto:${content.identity.email}`} label={content.contact.emailLabel} className="pill-link primary-pill" />
              <SmartLink href={content.identity.github} label="GitHub" className="text-link" />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer shell">
        <p>© {new Date().getFullYear()} {content.identity.englishName}</p>
        <p>{content.contact.footerNote}</p>
        <a href="#top">위로</a>
      </footer>

      {canEdit ? (
        <ContentEditor
          key={`${editorTab}-${editorOpen ? "open" : "closed"}`}
          open={editorOpen}
          initialTab={editorTab}
          content={content}
          dirty={dirty}
          onChange={setContent}
          onReloadPublished={() => setContent(initialContent)}
          onClose={requestCloseEditor}
          onSaved={(nextContent) => {
            setContent(nextContent);
            setSavedContent(nextContent);
          }}
        />
      ) : null}
    </>
  );
}
