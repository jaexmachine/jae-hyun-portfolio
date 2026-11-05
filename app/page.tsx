"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    index: "01", title: "Predictive Coastal\nSubsidence Heatmap", label: "LEAD RESEARCH · GEOAI", state: "IN PROGRESS",
    description: "A spatial-temporal AI pipeline exploring multi-year land subsidence patterns across Metro Manila’s CAMANAVA corridor.",
    stack: ["ConvLSTM", "Random Forest", "SHAP", "GeoPandas", "FastAPI", "Mapbox GL JS"], accent: "mint", anchor: "research",
  },
  {
    index: "02", title: "Marketplace\nIntelligence Pipeline", label: "ETL · DATA ANALYTICS", state: "BUILT",
    description: "An automated pipeline that organizes localized marketplace listings into structured data for pricing and market analysis.",
    stack: ["Python", "ETL", "Data Analysis", "Automation"], accent: "blue", anchor: "marketplace",
  },
  {
    index: "03", title: "Canvas LMS\nScraper", label: "WEB AUTOMATION · PARSING", state: "BUILT",
    description: "A DOM-parsing workflow that turns assessment content into a structured, queryable format and an interactive dashboard.",
    stack: ["Python", "DOM Parsing", "Automation", "Dashboard"], accent: "peach", anchor: "canvas",
  },
];

const skills = ["Python", "PyTorch", "Scikit-learn", "Pandas", "SQL", "Matplotlib", "Seaborn", "Jupyter", "MATLAB", "Azure", "Git", "GitHub Actions", "Google Analytics", "Google Sheets"];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className={diagonal ? "arrow diagonal" : "arrow"}><path d="M3 10h13M10 4l6 6-6 6" /></svg>;
}

function Scene({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`build-scene ${className}`} data-build-scene aria-label={id}>
    <div className="scene-surface">{children}
      <div className="edit-selection" aria-hidden="true"><i /><i /><i /><i /><b /><b /><b /><b /></div>
      <div className="builder-cursor cursor-one" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/><path d="m11.7 17.2 4.7 6.7"/></svg><span>agent.01</span></div>
      <div className="builder-cursor cursor-two" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/><path d="m11.7 17.2 4.7 6.7"/></svg><span>agent.02</span></div>
      <span className="scene-progress" aria-hidden="true"><i /></span>
    </div>
  </section>;
}

function SceneTag({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="scene-tag"><span>{n}</span><span className="tag-dot" />{children}</div>;
}

function ProjectDisclosure({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (hasMounted.current) ScrollTrigger.refresh();
    else hasMounted.current = true;
  }, [open]);

  return <div className={`project-disclosure ${open ? "is-open" : ""}`}>
    <button className="see-more-button inline-flex items-center gap-2 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" type="button" aria-expanded={open} aria-controls={`${id}-details`} onClick={() => setOpen((value) => !value)}>
      {open ? "See less" : "See more"}<span aria-hidden="true">{open ? "−" : "↗"}</span>
    </button>
    <div className="project-extra" id={`${id}-details`} aria-hidden={!open}>
      <div className="project-extra-inner">{children}</div>
    </div>
  </div>;
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setReady(true); return; }
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-build-scene]");
      scenes.forEach((scene) => {
        const items = gsap.utils.toArray<HTMLElement>("[data-build-item]", scene);
        const frame = scene.querySelector<HTMLElement>(".edit-selection");
        const cursors = [scene.querySelector<HTMLElement>(".cursor-one"), scene.querySelector<HTMLElement>(".cursor-two")];
        const progressLine = scene.querySelector<HTMLElement>(".scene-progress i");
        const overlayLayer = scene.querySelector<HTMLElement>(".scene-surface") ?? scene;
        const box = (el: HTMLElement) => {
          const s = overlayLayer.getBoundingClientRect(), r = el.getBoundingClientRect();
          return { x: r.left - s.left, y: r.top - s.top, width: r.width, height: r.height };
        };
        const boxProps = (el: HTMLElement) => ({
          x: () => box(el).x, y: () => box(el).y,
          width: () => box(el).width, height: () => box(el).height,
        });
        const point = (el: HTMLElement) => {
          const b = box(el); return { x: b.x + b.width * .74, y: b.y + b.height * .74 };
        };
        const pointProps = (el: HTMLElement) => ({ x: () => point(el).x, y: () => point(el).y });

        if (scene.id === "home") {
          const headline = scene.querySelector<HTMLElement>("h1");
          const art = scene.querySelector<HTMLElement>(".hero-art");
          const profileTag = scene.querySelector<HTMLElement>(".hero-copy .scene-tag");
          const sideNote = scene.querySelector<HTMLElement>(".hero-side-note");
          if (!headline || !art) return;

          const details = [
            profileTag,
            ...items.filter((item) => item !== headline),
            sideNote,
          ].filter((item): item is HTMLElement => item !== null);
          const headlineRect = headline.getBoundingClientRect();
          const centeredX = window.innerWidth / 2 - (headlineRect.left + headlineRect.width / 2);
          const centeredY = window.innerHeight / 2 - (headlineRect.top + headlineRect.height / 2);

          gsap.set(items, { autoAlpha: 0, visibility: "hidden", x: 0, y: 0, scale: 1, filter: "none" });
          gsap.set(headline, {
            autoAlpha: 1, visibility: "visible", x: centeredX, y: centeredY,
            scale: 1.04, transformOrigin: "center center", textAlign: "center",
          });
          gsap.set([art, profileTag, sideNote], { autoAlpha: 0, visibility: "hidden" });
          if (details[0]) gsap.set(frame, { ...box(details[0]), autoAlpha: 0, scale: 0.97, transformOrigin: "top left" });
          if (cursors[0] && details[0]) gsap.set(cursors[0], { x: box(details[0]).x - 28, y: box(details[0]).y - 20, autoAlpha: 0 });
          if (cursors[1] && details[1]) gsap.set(cursors[1], { x: box(details[1]).x - 48, y: box(details[1]).y + box(details[1]).height + 20, autoAlpha: 0 });

          const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: {
            trigger: scene, start: "top top", end: () => `+=${Math.max(900, window.innerHeight * 1.28)}`,
            scrub: 0.8, pin: true, pinSpacing: true, invalidateOnRefresh: true,
            onLeave: () => gsap.set(details, { autoAlpha: 1, visibility: "visible" }),
          }});

          // Let the thought land first. Then move it into its editorial position
          // before rebuilding the supporting details around it.
          timeline.to(headline, { x: 0, y: 0, scale: 1, duration: 0.37, ease: "power3.inOut" }, 0)
            .set(headline, { textAlign: "left" }, 0.37)
            .to(art, { autoAlpha: 1, visibility: "visible", duration: 0.08 }, 0.39);

          const buildStart = 0.44;
          const buildEnd = 0.86;
          const step = (buildEnd - buildStart) / Math.max(details.length, 1);
          details.forEach((item, i) => {
            const startAt = buildStart + i * step;
            const next = details[i + 1];
            timeline.to(frame, { ...boxProps(item), autoAlpha: 0.96, scale: 1, borderColor: i % 2 ? "#c2b7ff" : "#83b6ff", duration: step * 0.58 }, startAt);
            if (cursors[0]) timeline.to(cursors[0], { ...pointProps(item), autoAlpha: 1, duration: step * 0.55 }, startAt);
            if (cursors[1] && next) timeline.to(cursors[1], { ...pointProps(next), autoAlpha: 0.84, duration: step * 0.68 }, startAt + step * 0.12);
            timeline.to(item, { autoAlpha: 1, visibility: "visible", duration: step * 0.3, ease: "power1.out" }, startAt + step * 0.62);
          });
          timeline.to(details, { autoAlpha: 1, visibility: "visible", duration: 0.12, stagger: 0.012, ease: "power2.out" }, buildEnd + 0.04)
            .to(frame, { autoAlpha: 0, scale: 1.025, duration: 0.12 }, buildEnd + 0.04)
            .to(cursors, { autoAlpha: 0, duration: 0.12 }, buildEnd + 0.04);
          return;
        }

        if (!items.length || !frame) return;
        const firstBox = box(items[0]);
        gsap.set(items, { autoAlpha: 0, visibility: "hidden", x: 0, y: 0, scale: 1, filter: "none" });
        gsap.set(frame, { ...firstBox, autoAlpha: 0, scale: 0.97, transformOrigin: "top left" });
        if (cursors[0]) gsap.set(cursors[0], { x: firstBox.x - 28, y: firstBox.y - 20, autoAlpha: 0 });
        if (cursors[1]) gsap.set(cursors[1], { x: firstBox.x - 50, y: firstBox.y + firstBox.height + 20, autoAlpha: 0 });

        const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: {
          trigger: scene, start: "top top", end: () => `+=${Math.max(760, window.innerHeight * 1.12)}`,
          scrub: 0.8, pin: true, pinSpacing: true, invalidateOnRefresh: true,
          onLeave: () => gsap.set(items, { autoAlpha: 1, visibility: "visible" }),
        }});
        const buildStart = 0.08;
        const buildEnd = 0.80;
        const step = (buildEnd - buildStart) / items.length;
        items.forEach((item, i) => {
          const startAt = buildStart + i * step;
          const next = items[i + 1];
          const color = i % 2 ? "#c2b7ff" : "#83b6ff";

          // The frame glides from element to element, then lands on its exact DOM bounds.
          timeline.to(frame, { ...boxProps(item), autoAlpha: 0.96, scale: 1, borderColor: color, duration: step * 0.58 }, startAt);
          if (cursors[0]) timeline.to(cursors[0], { ...pointProps(item), autoAlpha: 1, duration: step * 0.55 }, startAt);
          if (cursors[1] && next) timeline.to(cursors[1], { ...pointProps(next), autoAlpha: 0.84, duration: step * 0.7 }, startAt + step * 0.12);

          // Once selected, keep the real page element assembled while the agent
          // moves on to the next one.
          timeline.to(item, { autoAlpha: 1, visibility: "visible", duration: step * 0.28, ease: "power1.out" }, startAt + step * 0.62);
        });
        timeline.to(items, { autoAlpha: 1, visibility: "visible", duration: 0.12, stagger: 0.012, ease: "power2.out" }, buildEnd + 0.04)
          .to(frame, { autoAlpha: 0, scale: 1.025, duration: 0.12 }, buildEnd + 0.04)
          .to(cursors, { autoAlpha: 0, duration: 0.12 }, buildEnd + 0.04);
        if (progressLine) timeline.to(progressLine, { scaleX: 1, duration: 0.98, ease: "none" }, 0);
      });
      gsap.fromTo(".ambient-orb", { y: 0 }, { y: -110, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } });
      setReady(true);
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (ready) document.documentElement.classList.add("motion-ready");
    return () => document.documentElement.classList.remove("motion-ready");
  }, [ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText("18jaehyun05@gmail.com"); setToast("Email copied to clipboard"); }
    catch { window.location.href = "mailto:18jaehyun05@gmail.com"; }
  };
  const finishBuild = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
    gsap.set("[data-build-item]", { autoAlpha: 1, visibility: "visible", clearProps: "filter,transform" });
    gsap.set(".edit-selection,.builder-cursor", { autoAlpha: 0 });
    document.documentElement.classList.add("motion-ready");
    document.querySelector("#research")?.scrollIntoView({ behavior: "smooth" });
  };

  return <main ref={root}>
    <div className="ambient-orb orb-a" /><div className="ambient-orb orb-b" />
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Jae Hyun home"><span className="brand-mark">j<span>.</span></span><span className="brand-name">jae hyun<br /><small>PORTFOLIO / 2026</small></span></a>
      <nav className="flex items-center gap-2 sm:gap-3 md:gap-8" aria-label="Main navigation"><a href="#research">Work</a><a href="#about">About</a><a href="#experience">Journey</a><a href="#contact">Contact</a></nav>
      <div className="top-actions"><span className="availability"><i /> OPEN TO OPPORTUNITIES</span><a className="contact-pill" href="#contact">Let’s talk <Arrow diagonal /></a></div>
    </header>

    <Scene id="home" className="hero-scene">
      <div className="hero-grid">
        <div className="hero-copy">
          <SceneTag n="01">PERSONAL PROFILE</SceneTag>
          <p className="eyebrow" data-build-item>COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE</p>
          <h1 data-build-item>Making sense<br />of <span className="serif-italic">what’s next.</span></h1>
          <p className="hero-description" data-build-item>I’m Jae Hyun Tukushima — an AI and data analyst drawn to questions that live between complex data and the real world.</p>
          <div className="hero-buttons" data-build-item><a className="button button-primary" href="#research">Explore my work <Arrow /></a><a className="button button-quiet" href="#about">A little about me <span>↘</span></a></div>
          <div className="hero-footnote" data-build-item><span>SCROLL TO WATCH IT COME TOGETHER</span><span className="scroll-line" /></div>
        </div>
        <div className="hero-art" aria-label="Portfolio being assembled in a design workspace">
          <div className="art-orbit orbit-outer" /><div className="art-orbit orbit-inner" />
          <div className="art-chip chip-top" data-build-item><span className="chip-spark">✳</span> curious by default</div>
          <div className="profile-card" data-build-item>
            <div className="profile-card-top"><span>PROFILE / 001</span><span className="live-indicator">● LIVE</span></div>
            <div className="portrait-abstract"><span className="portrait-sun"/><span className="portrait-hill hill-one"/><span className="portrait-hill hill-two"/><span className="portrait-stem">JH</span><div className="portrait-caption">METRO MANILA<br/>14.5995° N / 120.9842° E</div></div>
            <div className="profile-card-bottom"><div><strong>Jae Hyun Tukushima</strong><span>AI / Data Analyst</span></div><span className="card-index">01 — 04</span></div>
          </div>
          <div className="art-chip chip-bottom" data-build-item><span className="chip-line" /> turning patterns into perspective</div>
          <div className="coordinates">14°35’58.2”N<br/>120°59’02.5”E</div>
        </div>
      </div>
      <div className="hero-side-note">SCROLL / BUILD SEQUENCE&nbsp;&nbsp; ↓</div>
    </Scene>

    <div className="ticker" aria-label="Areas of interest"><div className="ticker-track"><span>ARTIFICIAL INTELLIGENCE</span><b>✳</b><span>DATA ANALYTICS</span><b>✳</b><span>GEOAI & SPATIAL SYSTEMS</span><b>✳</b><span>INTELLIGENT AUTOMATION</span><b>✳</b><span>ARTIFICIAL INTELLIGENCE</span><b>✳</b><span>DATA ANALYTICS</span><b>✳</b><span>GEOAI & SPATIAL SYSTEMS</span><b>✳</b><span>INTELLIGENT AUTOMATION</span><b>✳</b></div></div>

    <Scene id="research" className="work-scene">
      <div className="section-wrap">
        <div className="section-heading"><div><SceneTag n="02">FEATURED RESEARCH</SceneTag><h2 data-build-item>Where data<br />meets <span className="serif-italic">place.</span></h2></div><p data-build-item className="section-intro">A work in progress, driven by a question worth mapping: how might we better understand the ground beneath our cities?</p></div>
        <article className="research-card" data-build-item>
          <div className="research-visual"><div className="map-grid"/><div className="map-ring ring-one"/><div className="map-ring ring-two"/><div className="map-ring ring-three"/><div className="map-line line-one"/><div className="map-line line-two"/><div className="map-hotspot"><i/></div><span className="map-label label-one">CAMANAVA</span><span className="map-label label-two">METRO MANILA</span><div className="map-legend"><i/>SPATIAL SIGNAL / 001</div><div className="map-axis">N<br/>↑</div></div>
          <div className="research-detail"><div className="research-topline"><span>01 / RESEARCH</span><span className="status-chip"><i/> IN PROGRESS</span></div><h3>Predictive Coastal<br />Subsidence Heatmap<br /><em>Modeling</em></h3><p>Architecting a hybrid spatial-temporal AI pipeline to forecast multi-year land subsidence trajectories across Metro Manila’s CAMANAVA corridor.</p><div className="research-bottom"><div className="tag-list"><span>ConvLSTM</span><span>Random Forest</span><span>SHAP / XAI</span><span>GeoPandas</span><span>FastAPI</span><span>Mapbox GL JS</span></div><div className="research-meta"><span>LEAD RESEARCHER</span><span>OCT 2026 — PRESENT</span></div></div><ProjectDisclosure id="geoai"><div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>APPROACH</span><p>A hybrid pipeline pairing ConvLSTM with Random Forest to study spatial and temporal patterns.</p></div><div><span>DECISION SUPPORT</span><p>A dashboard is being designed for 2D risk heatmaps, SHAP feature attributions, and localized diagnostic cards.</p></div></div><p className="details-footnote">Ongoing research · results and model performance are not yet final.</p></ProjectDisclosure></div>
          <span className="resize-caption">AI EDITING · SECTION 02</span>
        </article>
        <div className="section-bottomline"><span>SCROLL TO CONTINUE BUILD</span><span>01 — 03 <Arrow diagonal /></span></div>
      </div>
    </Scene>

    <section className="projects-section" id="projects">
      <div className="section-wrap"><div className="projects-heading"><div><SceneTag n="03">SELECTED BUILDS</SceneTag><h2>Small systems.<br /><span className="serif-italic">Useful outcomes.</span></h2></div><p>Ideas moved from messy inputs to something a person can use.</p></div>
        <div className="project-list">{projects.slice(1).map((p) => <article className={`project-row accent-${p.accent}`} id={p.anchor} key={p.index} data-build-scene>
          <div className="project-visual" data-build-item><div className="project-visual-grid"/><div className={`project-graphic graphic-${p.index}`}><span/><span/><span/><span/><i/></div><span className="visual-code">{p.index === "02" ? "data → insight" : "DOM → dataset"}</span><span className="visual-serial">{p.index} / 03</span></div>
          <div className="project-info"><SceneTag n={p.index}>{p.label}</SceneTag><div className="project-title-row"><h3 data-build-item>{p.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><span className="project-status" data-build-item>{p.state}</span></div><p data-build-item>{p.description}</p><div className="tag-list" data-build-item>{p.stack.map(t => <span key={t}>{t}</span>)}</div><div data-build-item><ProjectDisclosure id={p.anchor}>{p.index === "02" ? <div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>PIPELINE</span><p>Automated collection, cleaning, filtering, and structuring of localized listing data.</p></div><div><span>ANALYSIS</span><p>Pricing, location, and condition data are consolidated for market analysis and a localized assistant.</p></div></div> : <div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>COLLECTION</span><p>DOM parsing to work with Canvas LMS content in a dynamically rendered interface.</p></div><div><span>OUTPUT</span><p>Assessment questions become structured, queryable data for an interactive dashboard.</p></div></div>}</ProjectDisclosure></div></div>
          <div className="edit-selection" aria-hidden="true"><i/><i/><i/><i/><b/><b/><b/><b/></div><div className="builder-cursor cursor-one" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/></svg><span>agent.01</span></div><div className="builder-cursor cursor-two" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/></svg><span>agent.02</span></div>
        </article>)}</div>
      </div>
    </section>

    <Scene id="about" className="about-scene">
      <div className="section-wrap about-layout"><div className="about-left"><SceneTag n="04">A LITTLE CONTEXT</SceneTag><h2 data-build-item>Curious about<br />systems. <span className="serif-italic">Grounded<br />in people.</span></h2><p data-build-item>I’m studying Computer Science with a specialization in Artificial Intelligence at FEU Institute of Technology. I like translating technical ideas into tools, workshops, and insights people can actually use.</p><a className="text-link" href="https://www.linkedin.com/in/jae-hyun-tukushima/" target="_blank" rel="noreferrer" data-build-item>More on LinkedIn <Arrow diagonal /></a></div><div className="about-right">
        <div className="about-note note-one" data-build-item><span className="note-icon">↗</span><div><small>THINK IN SYSTEMS</small><p>From spatial signals to a well-shaped dataset.</p></div><span className="note-number">01</span></div>
        <div className="about-note note-two" data-build-item><span className="note-icon">✳</span><div><small>BUILD FOR PEOPLE</small><p>Clear tools. Shared knowledge. Better decisions.</p></div><span className="note-number">02</span></div>
        <div className="about-note note-three" data-build-item><span className="note-icon">⌁</span><div><small>STAY CURIOUS</small><p>Always learning, always asking one more question.</p></div><span className="note-number">03</span></div>
        <div className="about-stamp">LEARNING<br/>IN PUBLIC<br/><b>✳</b></div>
      </div><div className="skills-panel" data-build-item><div><span className="skills-label">TOOLS I REACH FOR</span><p>A practical toolkit for exploring, modeling, and sharing.</p></div><div className="skills-cloud">{skills.map((skill, i) => <span key={skill} style={{"--skill-index": i} as React.CSSProperties}>{skill}</span>)}</div></div></div>
    </Scene>

    <Scene id="experience" className="journey-scene">
      <div className="section-wrap"><div className="journey-heading"><div><SceneTag n="05">THE JOURNEY SO FAR</SceneTag><h2>Learning by<br /><span className="serif-italic">building together.</span></h2></div><p>Leadership has meant making room for more people to learn, build, and try.</p></div>
        <div className="timeline-list">
          <article className="timeline-item" data-build-item><div className="timeline-year">AUG 2025 — AUG 2026</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><span>FEU TECH ACM STUDENT CHAPTER</span><span>02 / LEADERSHIP</span></div><h3>Associate Director<br />for Academics</h3><p>Spearheaded review sessions, AI building workshops, and prompt engineering programs. Helped deliver FEU Tech Developers Week and a flagship university hackathon, advising 40+ competing teams. Secured DataCamp Donates premium access for 200+ members.</p><div className="timeline-tags"><span>ACADEMIC PROGRAMS</span><span>COMMUNITY</span><span>EVENT LEADERSHIP</span></div></div></article>
          <article className="timeline-item" data-build-item><div className="timeline-year">AUG 2024 — AUG 2025</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><span>FEU TECH ACM STUDENT CHAPTER</span><span>01 / LEADERSHIP</span></div><h3>Junior Officer<br />for Academics</h3><p>Directed peer-led review sessions and designed a scalable structure for academic initiatives. Facilitated interactive Data Science workshops for 40+ students using Google Colab.</p><div className="timeline-tags"><span>DATA SCIENCE</span><span>PEER LEARNING</span><span>GOOGLE COLAB</span></div></div></article>
        </div><div className="education-strip" data-build-item><span>EDUCATION</span><strong>FEU Institute of Technology</strong><span>BS Computer Science · Artificial Intelligence</span><span>AUG 2024 — PRESENT</span></div>
      </div>
    </Scene>

    <Scene id="recognition" className="recognition-scene">
      <div className="section-wrap"><div className="section-heading"><div><SceneTag n="06">RECOGNITION & LEARNING</SceneTag><h2>Milestones<br />along the <span className="serif-italic">way.</span></h2></div><p className="section-intro">Recognition for the work so far, and credentials earned along the way.</p></div>
        <div className="recognition-grid"><article className="award-card award-feature" data-build-item><div className="award-symbol">✳</div><span>ACADEMIC HONOR</span><h3>President’s<br />Scholarship Award</h3><p>Highest Honors Awardee<br />100% tuition coverage · FEU Institute of Technology</p><div className="award-year">01 <span>— 2024</span></div></article><article className="award-card" data-build-item><div className="award-symbol rank-symbol">#1</div><span>TOP PERFORMING STUDENT</span><h3>Rank 1</h3><p>A.Y. 2024–2025<br />FEU Institute of Technology</p><div className="award-year">02 <span>— 2025</span></div></article><article className="award-card" data-build-item><div className="award-symbol">◎</div><span>NATIONAL SCHOLARSHIP</span><h3>DOST–SEI<br />Scholar</h3><p>Selected among 10,756<br />from 89,510 applicants</p><div className="award-year">03 <span>— 2024</span></div></article></div>
        <div className="cert-row" data-build-item><span className="cert-label">CERTIFICATIONS</span><div>{["Microsoft Azure AI Essentials", "GitHub Foundations", "ITS Python", "Salesforce AI Associate", "Working with the OpenAI API", "Data Literacy"].map(c=><span key={c}>{c}<i>↗</i></span>)}</div></div>
      </div>
    </Scene>

    <section className="contact-section" id="contact"><div className="contact-glow"/><div className="contact-inner"><SceneTag n="07">NEXT, LET’S MAKE SOMETHING USEFUL</SceneTag><h2>Have a good<br />question? <span className="serif-italic">I’m in.</span></h2><p>Open to opportunities in AI, data, and thoughtful technology.</p><button className="button button-primary email-button" onClick={copyEmail}>Get in touch <Arrow /></button><div className="contact-links"><a href="mailto:18jaehyun05@gmail.com">18jaehyun05@gmail.com <Arrow diagonal /></a><a href="https://www.linkedin.com/in/jae-hyun-tukushima/" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a><a href="https://github.com/jaexmachine" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a></div><div className="contact-meta"><span>MANILA, PHILIPPINES</span><span>BUILT WITH CARE · 2026</span></div></div></section>
    <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">j<span>.</span></span><span className="brand-name">jae hyun<br/><small>PORTFOLIO / 2026</small></span></a><span>AN OPEN-ENDED WORK IN PROGRESS <i>✳</i></span><a href="#home">BACK TO TOP ↑</a></footer>
    <button className="skip-build" onClick={finishBuild} aria-label="Skip the build animation">Skip build <span>↗</span></button>
    <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}<span>✓</span></div>
  </main>;
}
