"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EVIDENCE_LABELS, type ExperienceItem, type PortfolioContent } from "../lib/portfolio-content";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const nav = [["education", "Education"], ["career", "Career"], ["activities", "Activities"], ["credentials", "Credentials"], ["projects", "Projects"], ["view", "View"]] as const;
const localPath = (value: string) => value.startsWith("/") ? `${basePath}${value}` : value;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={localPath(href)} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{children}<span aria-hidden="true">↗</span></a>;
}

function EvidenceTag({ item }: { item: { evidenceState: keyof typeof EVIDENCE_LABELS; observedAt: string } }) {
  return <span className={`evidence-tag state-${item.evidenceState}`}>{EVIDENCE_LABELS[item.evidenceState]} · {item.observedAt}</span>;
}

function DisclosureMark() {
  return <span className="disclosure-mark" aria-hidden="true" />;
}

function Timeline({ items }: { items: ExperienceItem[] }) {
  return <div className="editorial-list">{items.map((item, index) => <details className="editorial-row" key={`${item.period}-${item.role}`} open={index === 0}>
    <summary><time>{item.period}</time><div className="editorial-row-main"><h3>{item.role}</h3><p className="organization">{item.organization}</p></div><DisclosureMark /></summary>
    <div className="editorial-row-body"><p>{item.description}</p><EvidenceTag item={item} /></div>
  </details>)}</div>;
}

export default function PortfolioSite({ content }: { content: PortfolioContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main-content">본문 바로가기</a>
    <header className="site-header">
      <a className="wordmark" href="#profile" aria-label="김서준 포트폴리오 홈">KIM SEOJUN</a>
      <button ref={menuButton} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
      <nav id="site-nav" className={menuOpen ? "is-open" : ""} aria-label="주요 메뉴">{nav.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
    </header>

    <main id="main-content">
      <section className="profile-hero" id="profile" aria-labelledby="profile-name">
        <div className="profile-name-block"><p>ARCHITECTURE × AI AUTOMATION</p><h1 id="profile-name"><span>{content.identity.name}</span><strong>{content.identity.englishName}</strong></h1></div>
        <figure className="profile-portrait"><Image src={localPath(content.hero.image)} alt={content.hero.imageAlt} fill sizes="(max-width: 760px) 86vw, 34vw" priority unoptimized /></figure>
        <div className="profile-index">
          <p>{content.hero.title}<br /><strong>{content.hero.highlight}</strong></p>
          <ol><li>Architecture student</li><li>CAD/BIM workflow builder</li><li>AI & data product maker</li></ol>
          <div className="profile-links"><ExternalLink href={content.identity.github}>GitHub</ExternalLink><ExternalLink href={`mailto:${content.identity.email}`}>Email</ExternalLink><a href="#projects">프로젝트 살펴보기 ↓</a></div>
        </div>
        <p className="profile-statement">{content.about.description}</p>
      </section>

      <section className="editorial-section" id="education" aria-labelledby="education-title">
        <h2 id="education-title">EDUCATION</h2>
        <div className="editorial-list">{content.education.map((item, index) => <details className="editorial-row" key={item.course} open={index === 0}>
          <summary><time>{item.period}</time><div className="editorial-row-main"><h3>{item.institution}</h3><p className="organization">{item.course}</p></div><DisclosureMark /></summary>
          <div className="editorial-row-body"><p>{item.description}</p><EvidenceTag item={item} /></div>
        </details>)}</div>
      </section>

      <section className="editorial-section" id="career" aria-labelledby="career-title"><h2 id="career-title">CAREER</h2><Timeline items={content.experiences} /></section>
      <section className="editorial-section" id="activities" aria-labelledby="activities-title"><h2 id="activities-title">ACTIVITIES</h2><Timeline items={content.activities} /></section>

      <section className="editorial-section" id="credentials" aria-labelledby="credentials-title">
        <h2 id="credentials-title">CREDENTIALS</h2>
        <div className="credential-list">{content.credentials.map((item, index) => <details key={item}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><DisclosureMark /></summary>
          <div className="credential-body"><small>지원서 자기기재 · 증빙 원본 확인 전</small></div>
        </details>)}</div>
      </section>

      <section className="editorial-section project-section" id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">PROJECTS</h2>
        <div className="project-list">{content.projects.filter((project) => project.visibility === "public").map((project, index) => <details className="project-entry" id={project.id} key={project.id} open={index === 0}>
          <summary><div className="project-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="project-copy"><p className="project-category">{project.category}</p><h3>{project.title}</h3><p className="project-summary">{project.summary}</p></div>
            <figure><Image src={localPath(project.image)} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 34vw" unoptimized /></figure>
            <DisclosureMark />
          </summary>
          <div className="project-expanded">
            <dl><div><dt>문제</dt><dd>{project.problem}</dd></div><div><dt>직접 기여</dt><dd>{project.myRole}</dd></div><div><dt>산출물</dt><dd>{project.artifact}</dd></div><div><dt>검증 근거</dt><dd>{project.proof}</dd></div><div><dt>한계</dt><dd>{project.boundary}</dd></div></dl>
            <div className="project-meta"><EvidenceTag item={project} />{project.links.map((link) => <ExternalLink href={link.href} key={link.href}>{link.label}</ExternalLink>)}</div>
          </div>
        </details>)}</div>
      </section>

      <section className="view-section" id="view" aria-labelledby="view-title">
        <div className="view-heading"><h2 id="view-title">VIEW</h2><p>이미지를 선택하면 해당 프로젝트의 작업 내용과 근거로 이동합니다.</p></div>
        <div className="image-index">{content.projects.filter((p) => p.visibility === "public").map((project) => <a href={`#${project.id}`} key={project.id}><figure><Image src={localPath(project.image)} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" unoptimized /></figure><span>{project.observedAt.slice(0,4)}</span><strong>{project.title}</strong></a>)}</div>
      </section>
    </main>

    <footer><div><strong>{content.identity.name}</strong><span>{content.identity.role}</span></div><div><ExternalLink href={`mailto:${content.identity.email}`}>{content.identity.email}</ExternalLink><ExternalLink href={content.identity.github}>GitHub</ExternalLink></div><p>© {new Date().getFullYear()} {content.identity.englishName}</p></footer>
  </>;
}
