"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EVIDENCE_LABELS, type ExperienceItem, type PortfolioContent } from "../lib/portfolio-content";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const nav = [["projects", "프로젝트"], ["education", "학력"], ["career", "경력"], ["activities", "활동"], ["credentials", "자격"], ["contact", "연락하기"]] as const;
const localPath = (value: string) => value.startsWith("/") ? `${basePath}${value}` : value;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={localPath(href)} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{children}<span aria-hidden="true">↗</span></a>;
}

function EvidenceTag({ item }: { item: { evidenceState: keyof typeof EVIDENCE_LABELS; observedAt: string } }) {
  return <span className={`evidence-tag state-${item.evidenceState}`}><span className="evidence-dot" aria-hidden="true" />{EVIDENCE_LABELS[item.evidenceState]}<span className="evidence-date">{item.observedAt}</span></span>;
}

function DisclosureMark() {
  return <span className="disclosure-mark" aria-hidden="true" />;
}

function SectionHeading({ number, english, title, id }: { number: string; english: string; title: string; id: string }) {
  return <div className="section-heading"><p className="section-kicker"><span>{number}</span>{english}</p><h2 id={id}>{title}</h2></div>;
}

function Timeline({ items }: { items: ExperienceItem[] }) {
  return <div className="editorial-list">{items.filter((item) => item.visibility === "public").map((item, index) => <details className="editorial-row" key={`${item.period}-${item.role}`} open={index === 0}>
    <summary><time>{item.period}</time><div className="editorial-row-main"><h3>{item.role}</h3><p className="organization">{item.organization}</p></div><DisclosureMark /></summary>
    <div className="editorial-row-body"><p>{item.description}</p><EvidenceTag item={item} /></div>
  </details>)}</div>;
}

export default function PortfolioSite({ content }: { content: PortfolioContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const projects = content.projects.filter((project) => project.visibility === "public");

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    for (const [id] of nav) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  function revealProject(id: string) {
    const details = document.getElementById(id)?.querySelector("details");
    if (details) details.open = true;
  }

  return <>
    <a className="skip-link" href="#main-content">본문 바로가기</a>
    <header className="site-header">
      <a className="wordmark" href="#profile" aria-label={`${content.identity.name} 포트폴리오 홈`}><span className="wordmark-symbol" aria-hidden="true">{content.identity.monogram}</span><span>{content.identity.englishName}<small>Architecture & digital practice</small></span></a>
      <button ref={menuButton} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "메뉴 닫기 −" : "메뉴 +"}</button>
      <nav id="site-nav" className={menuOpen ? "is-open" : ""} aria-label="주요 메뉴">{nav.map(([id, label]) => <a href={`#${id}`} key={id} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
    </header>

    <main id="main-content">
      <section className="profile-hero" id="profile" aria-labelledby="profile-title">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" />{content.hero.eyebrow}</p>
          <h1 id="profile-title">{content.hero.title}<br /><strong>{content.hero.highlight}</strong></h1>
          <p className="hero-description">{content.hero.description}</p>
          <div className="hero-actions"><a className="primary-link" href="#projects">프로젝트 살펴보기 <span aria-hidden="true">↓</span></a><ExternalLink href={content.identity.github}>GitHub에서 코드 보기</ExternalLink></div>
        </div>
        <div className="profile-card">
          <figure className="profile-portrait"><Image src={localPath(content.hero.image)} alt={content.hero.imageAlt} fill sizes="(max-width: 760px) 120px, 240px" priority unoptimized /></figure>
          <div className="profile-caption"><strong>{content.identity.name}</strong><span>{content.identity.englishName}</span><p>{content.identity.role}</p></div>
        </div>
        <div className="hero-bottom"><p>{content.identity.status}</p><a href="#projects">작업에서 확인하는 역량 <span aria-hidden="true">↙</span></a></div>
      </section>

      <section className="project-section page-section" id="projects" aria-labelledby="projects-title">
        <div className="project-heading"><SectionHeading number="01" english="Projects" title="문제를 풀어온 과정" id="projects-title" /><p>문제 정의부터 구현과 검증까지.<br />직접 만든 결과와 남은 과제를 함께 기록합니다.</p></div>
        <div className="project-list">{projects.map((project, index) => <article className={`project-entry${index === 0 ? " project-featured" : ""}`} id={project.id} key={project.id}>
          <figure className="project-image"><Image src={localPath(project.image)} alt={project.imageAlt} fill sizes={index === 0 ? "(max-width: 760px) 92vw, 55vw" : "(max-width: 760px) 92vw, 44vw"} unoptimized /><figcaption>{String(index + 1).padStart(2, "0")} / {project.title}</figcaption></figure>
          <div className="project-copy">
            <p className="project-category">{project.category}</p>
            <h3>{project.title}</h3>
            <p className="project-summary">{project.summary}</p>
            <ul className="project-tags" aria-label={`${project.title} 기술과 분야`}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-links">{project.links.length ? project.links.map((link) => <ExternalLink href={link.href} key={link.href}>{link.label}</ExternalLink>) : <span className="project-link-note">공개 링크 준비 중</span>}</div>
            <EvidenceTag item={project} />
          </div>
          <details className="project-evidence">
            <summary><span>과정과 검증 근거</span><DisclosureMark /></summary>
            <div className="project-expanded"><dl>
              <div><dt>문제</dt><dd>{project.problem}</dd></div>
              <div><dt>내가 한 일</dt><dd>{project.myRole}</dd></div>
              <div><dt>산출물</dt><dd>{project.artifact}</dd></div>
              <div><dt>확인 근거</dt><dd>{project.proof}</dd></div>
              <div className="project-boundary"><dt>현재 한계</dt><dd>{project.boundary}</dd></div>
            </dl></div>
          </details>
        </article>)}</div>
        {!projects.length && <p className="empty-projects">현재 공개된 프로젝트가 없습니다.</p>}
      </section>

      <section className="about-section page-section" aria-labelledby="about-title">
        <p className="section-kicker">Approach</p><div className="about-copy"><h2 id="about-title">{content.about.title}</h2><p>{content.about.description}</p></div>
        <div className="capability-list">{content.capabilities.map((item, index) => <div key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
      </section>

      <section className="editorial-section page-section" id="education" aria-labelledby="education-title">
        <SectionHeading number="02" english="Education" title="학력" id="education-title" />
        <div className="editorial-list">{content.education.filter((item) => item.visibility === "public").map((item, index) => <details className="editorial-row" key={item.course} open={index === 0}>
          <summary><time>{item.period}</time><div className="editorial-row-main"><h3>{item.institution}</h3><p className="organization">{item.course}</p></div><DisclosureMark /></summary>
          <div className="editorial-row-body"><p>{item.description}</p><EvidenceTag item={item} /></div>
        </details>)}</div>
      </section>

      <section className="editorial-section page-section" id="career" aria-labelledby="career-title"><SectionHeading number="03" english="Career" title="현장에서 쌓은 경험" id="career-title" /><Timeline items={content.experiences} /></section>
      <section className="editorial-section page-section" id="activities" aria-labelledby="activities-title"><SectionHeading number="04" english="Activities" title="탐구와 협업" id="activities-title" /><Timeline items={content.activities} /></section>

      <section className="editorial-section page-section" id="credentials" aria-labelledby="credentials-title">
        <SectionHeading number="05" english="Credentials" title="자격과 학습" id="credentials-title" />
        <div className="credential-list">{content.credentials.map((item, index) => <details key={item}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><DisclosureMark /></summary>
          <div className="credential-body"><small>지원서 자기기재 · 증빙 원본 확인 전</small></div>
        </details>)}</div>
      </section>

      <section className="view-section page-section" id="view" aria-labelledby="view-title">
        <div className="view-heading"><SectionHeading number="06" english="View" title="작업 화면 모아보기" id="view-title" /><p>이미지를 선택하면 프로젝트의 상세 근거로 이동합니다.</p></div>
        <div className="image-index">{projects.map((project) => <a href={`#${project.id}`} key={project.id} onClick={() => revealProject(project.id)}><figure><Image src={localPath(project.image)} alt="" fill sizes="(max-width: 760px) 44vw, 22vw" unoptimized /></figure><strong>{project.title}<span aria-hidden="true">↗</span></strong></a>)}</div>
      </section>

      <section className="contact-section page-section" id="contact" aria-labelledby="contact-title"><p className="section-kicker">Contact</p><h2 id="contact-title">{content.contact.title}</h2><p>{content.contact.description}</p><ExternalLink href={`mailto:${content.identity.email}`}>{content.identity.email}</ExternalLink></section>
    </main>

    <footer><p>© {new Date().getFullYear()} {content.identity.englishName}</p><p>{content.contact.footerNote}</p><div><ExternalLink href={content.identity.github}>GitHub</ExternalLink><ExternalLink href="/edit/">내용 편집</ExternalLink><a href="#profile">맨 위로 ↑</a></div></footer>
  </>;
}
