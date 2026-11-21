import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import ProjectDisclosure from "./components/ProjectDisclosure";
import PortfolioShell from "./components/PortfolioShell";

const projects = [
  {
    index: "01", title: "Predictive Coastal\nSubsidence Heatmap", label: "LEAD RESEARCH · GEOAI", state: "IN PROGRESS",
    description: "A machine-learning project mapping land subsidence across CAMANAVA and exploring how it may change over time.",
    stack: ["ConvLSTM", "Random Forest", "SHAP", "GeoPandas", "FastAPI", "Mapbox GL JS"], accent: "mint", anchor: "research",
  },
  {
    index: "02", title: "DealBreaker\nMarketplace Intelligence", label: "ETL · DATA ANALYTICS", state: "BUILT",
    description: "A local-first Facebook Marketplace tool that turns selected listings into structured price, specification, location, and condition data for comparison.",
    stack: ["Python", "ETL", "Data Analysis", "Automation"], accent: "blue", anchor: "marketplace",
  },
  {
    index: "03", title: "Canvas LMS\nScraper", label: "WEB AUTOMATION · PARSING", state: "BUILT",
    description: "Turns Canvas assessment content into searchable data for analysis in an interactive dashboard.",
    stack: ["Python", "DOM Parsing", "Automation", "Dashboard"], accent: "peach", anchor: "canvas",
  },
];

const skills = ["Python", "PyTorch", "Scikit-learn", "Pandas", "SQL", "Matplotlib", "Seaborn", "Jupyter", "MATLAB", "Azure", "Git", "GitHub Actions", "Google Analytics", "Google Sheets"];

const certifications = [
  { name: "Microsoft Azure AI Essentials Professional Certificate", href: "https://www.linkedin.com/learning/certificates/080d6b824c3fa9fcbf762cb30515f81e4408409b17e0ca3303c750cf75aacef8" },
  { name: "GitHub Foundations", href: "https://learn.microsoft.com/en-us/users/jaehyuntukushima-3724/credentials/f1769157887c541" },
  { name: "ITS Python", href: "https://www.linkedin.com/in/jae-hyun-tukushima/details/certifications/" },
  { name: "Salesforce Certified AI Associate", href: "https://www.salesforce.com/trailblazer/zzxq01fvkve2vfhov7" },
  { name: "Working with the OpenAI API", href: "https://www.datacamp.com/skill-verification/UPE0011717254975" },
  { name: "Data Literacy", href: "https://www.datacamp.com/skill-verification/AIL0025060559865" },
];

const resumeLinks = {
  chapter: "https://web.facebook.com/feutechACM",
  developersWeek: "https://web.facebook.com/photo.php?fbid=1148916060679022&set=pb.100066819165778.-2207520000&type=3",
  rankAward: "https://web.facebook.com/photo/?fbid=1099817048922257&set=a.519143650322936",
  dostResults: "https://region4a.dost.gov.ph/calabarzon-leads-2024-dost-sei-st-undergraduate-examination/",
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className={diagonal ? "arrow diagonal" : "arrow"}><path d="M3 10h13M10 4l6 6-6 6" /></svg>;
}

function Scene({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`build-scene ${className}`} data-build-scene aria-label={id}>
    <div className="scene-surface">{children}
      <div className="edit-selection" aria-hidden="true"><i /><i /><i /><i /><b /><b /><b /><b /></div>
      <div className="builder-cursor cursor-one" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/><path d="m11.7 17.2 4.7 6.7"/></svg><span>agent.01</span></div>
      <div className="builder-cursor cursor-two" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/><path d="m11.7 17.2 4.7 6.7"/></svg><span>agent.02</span></div>
      <span className="scene-progress" aria-hidden="true"><i /></span>
    </div>
  </section>;
}

function SceneTag({ n, children }: { n: string; children: ReactNode }) {
  return <div className="scene-tag"><span>{n}</span><span className="tag-dot" />{children}</div>;
}

export default function Home() {
  return <PortfolioShell>
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Jae Hyun home"><span className="brand-mark"><Image className="brand-logo brand-logo-light" src="/rocket-j-light.png" alt="" width={1280} height={1280} sizes="42px" /><Image className="brand-logo brand-logo-dark" src="/rocket-j-dark.png" alt="" width={1280} height={1280} sizes="42px" priority /></span><span className="brand-name">jae hyun<br /><small>PORTFOLIO / 2026</small></span></a>
      <nav id="portfolio-navigation" className="site-nav flex items-center gap-2 sm:gap-3 md:gap-8" aria-label="Main navigation"><a className="is-active" aria-current="location" href="#research">Work</a><a href="#about">About</a><a href="#experience">Journey</a><a href="#contact">Contact</a></nav>
      <div className="top-actions"><span className="availability"><i /> OPEN TO OPPORTUNITIES</span><button className="theme-toggle" data-theme-toggle type="button" aria-label="Switch theme" aria-pressed="false" title="Switch theme"><span aria-hidden="true">☼</span></button><button className="mobile-menu-toggle" type="button" aria-controls="portfolio-navigation" aria-expanded="false" aria-label="Open navigation"><span/><span/></button><a className="contact-pill" href="#contact">Let’s talk <Arrow diagonal /></a></div>
    </header>

    <Scene id="home" className="hero-scene">
      <div className="hero-grid">
        <div className="hero-copy">
          <SceneTag n="01">PERSONAL PROFILE</SceneTag>
          <h1 data-build-item>Making sense<br />of <span className="hero-emphasis">what’s next.</span></h1>
          <div className="hero-essentials" data-build-item>
            <p className="eyebrow">COMPUTER SCIENCE · AI SPECIALIZATION</p>
            <p className="hero-description">I turn complex data into clear tools and insights people can act on.</p>
            <div className="hero-buttons"><a className="button button-primary" href="#research">Explore my work <Arrow /></a><a className="button button-quiet" href="#about">A little about me <span>↘</span></a></div>
          </div>
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
      <div className="hero-side-note">SCROLL - BUILD SEQUENCE&nbsp;&nbsp; ↓</div>
    </Scene>

    <div className="ticker" role="region" aria-label="Areas of interest">
      <div className="ticker-track">
        <div className="ticker-group" role="list">
          <span role="listitem">ARTIFICIAL INTELLIGENCE</span><b aria-hidden="true">✳</b>
          <span role="listitem">DATA ANALYTICS</span><b aria-hidden="true">✳</b>
          <span role="listitem">GEOAI &amp; SPATIAL SYSTEMS</span><b aria-hidden="true">✳</b>
          <span role="listitem">INTELLIGENT AUTOMATION</span><b aria-hidden="true">✳</b>
        </div>
        <div className="ticker-group" aria-hidden="true">
          <span>ARTIFICIAL INTELLIGENCE</span><b>✳</b>
          <span>DATA ANALYTICS</span><b>✳</b>
          <span>GEOAI &amp; SPATIAL SYSTEMS</span><b>✳</b>
          <span>INTELLIGENT AUTOMATION</span><b>✳</b>
        </div>
      </div>
    </div>

    <Scene id="research" className="work-scene">
      <div className="section-wrap">
        <div className="section-heading"><div><SceneTag n="02">FEATURED RESEARCH</SceneTag><h2 data-build-item>Where data<br />meets <span className="serif-italic">place.</span></h2></div><p data-build-item className="section-intro">How can we spot where land is sinking, and understand what might happen next?</p></div>
        <article className="research-card" data-build-item>
          <div className="research-visual"><div className="map-grid"/><div className="map-ring ring-one"/><div className="map-ring ring-two"/><div className="map-ring ring-three"/><div className="map-line line-one"/><div className="map-line line-two"/><div className="map-hotspot"><i/></div><span className="map-label label-one">CAMANAVA</span><span className="map-label label-two">METRO MANILA</span><div className="map-legend"><i/>SPATIAL SIGNAL / 001</div><div className="map-axis">N<br/>↑</div></div>
          <div className="research-detail"><div className="research-topline"><span>01 / RESEARCH</span><span className="status-chip"><i/> IN PROGRESS</span></div><h3>Predictive Coastal<br />Subsidence Heatmap<br /><em>Modeling</em></h3><p>I’m building a model to map land subsidence across Metro Manila’s CAMANAVA corridor and explore how it could change over time.</p><div className="research-bottom"><div className="tag-list"><span>ConvLSTM</span><span>Random Forest</span><span>SHAP / XAI</span><span>GeoPandas</span><span>FastAPI</span><span>Mapbox GL JS</span></div><div className="research-meta"><span>LEAD RESEARCHER</span><span>OCT 2026 — PRESENT</span></div></div><ProjectDisclosure id="geoai"><div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>APPROACH</span><p>Pairing ConvLSTM and Random Forest to study where and how subsidence patterns change.</p></div><div><span>DECISION SUPPORT</span><p>Planning a dashboard with risk maps, SHAP explanations, and local diagnostic cards.</p></div></div><p className="details-footnote">This research is ongoing; results are not final.</p></ProjectDisclosure></div>
          <span className="resize-caption">AI EDITING · SECTION 02</span>
        </article>
        <div className="section-bottomline"><span>SCROLL TO CONTINUE BUILD</span><span>01 — 03 <Arrow diagonal /></span></div>
      </div>
    </Scene>

    <section className="projects-section" id="projects">
      <div className="section-wrap"><div className="projects-heading"><div><SceneTag n="03">SELECTED BUILDS</SceneTag><h2>Small systems.<br /><span className="serif-italic">Useful outcomes.</span></h2></div><p>Practical builds that turn scattered information into clearer answers.</p></div>
        <div className="project-list">{projects.slice(1).map((p) => <article className={`project-row accent-${p.accent}`} id={p.anchor} key={p.index} data-build-scene>
          <div className="project-visual" data-build-item><div className="project-visual-grid"/><div className={`project-graphic graphic-${p.index}`}><span/><span/><span/><span/><i/></div><span className="visual-code">{p.index === "02" ? "data → insight" : "DOM → dataset"}</span><span className="visual-serial">{p.index} / 03</span></div>
          <div className="project-info"><SceneTag n={p.index}>{p.label}</SceneTag><div className="project-title-row"><h3 data-build-item>{p.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><span className="project-status" data-build-item>{p.state}</span></div><p data-build-item>{p.description}</p><div className="tag-list" data-build-item>{p.stack.map(t => <span key={t}>{t}</span>)}</div><div data-build-item><ProjectDisclosure id={p.anchor}>{p.index === "02" ? <div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>PIPELINE</span><p>Collects listings, cleans key fields, and organizes them into a consistent dataset.</p></div><div><span>WHAT IT HELPS WITH</span><p>Compares price, location, and condition to support market analysis and a local assistant.</p></div></div> : <div className="details-grid grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><div><span>COLLECTION</span><p>Reads assessment content from Canvas pages as it appears in the browser.</p></div><div><span>WHAT IT CREATES</span><p>Turns questions into structured data for search and dashboard analysis.</p></div></div>}</ProjectDisclosure></div></div>
          <div className="edit-selection" aria-hidden="true"><i/><i/><i/><i/><b/><b/><b/><b/></div><div className="builder-cursor cursor-one" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/></svg><span>agent.01</span></div><div className="builder-cursor cursor-two" aria-hidden="true"><svg viewBox="0 0 24 28"><path d="M3 2.5 20.5 17l-8 .8-3.6 7.1L3 2.5Z"/></svg><span>agent.02</span></div>
        </article>)}</div>
      </div>
    </section>

    <Scene id="about" className="about-scene">
      <div className="section-wrap about-layout"><div className="about-left"><SceneTag n="04">A LITTLE CONTEXT</SceneTag><h2 data-build-item>Curious about<br />systems. <span className="serif-italic">Grounded<br />in people.</span></h2><p data-build-item>I enjoy creating spaces where people can try new tools, ask better questions, and learn by building.</p><a className="text-link" href="https://www.linkedin.com/in/jae-hyun-tukushima/" target="_blank" rel="noreferrer" data-build-item>More on LinkedIn <Arrow diagonal /></a></div><div className="about-right">
        <div className="about-note note-one" data-build-item><span className="note-icon">↗</span><div><small>THINK IN SYSTEMS</small><p>From spatial signals to a well-shaped dataset.</p></div><span className="note-number">01</span></div>
        <div className="about-note note-two" data-build-item><span className="note-icon">✳</span><div><small>BUILD FOR PEOPLE</small><p>Clear tools. Shared knowledge. Better decisions.</p></div><span className="note-number">02</span></div>
        <div className="about-note note-three" data-build-item><span className="note-icon">⌁</span><div><small>STAY CURIOUS</small><p>Always learning, always asking one more question.</p></div><span className="note-number">03</span></div>
      </div><div className="skills-panel" data-build-item><div><span className="skills-label">TOOLS I REACH FOR</span><p>A practical toolkit for exploring, modeling, and sharing.</p></div><div className="skills-cloud">{skills.map((skill, i) => <span key={skill} style={{"--skill-index": i} as CSSProperties}>{skill}</span>)}</div></div></div>
    </Scene>

    <Scene id="experience" className="journey-scene">
      <div className="section-wrap"><div className="journey-heading"><div><SceneTag n="05">THE JOURNEY SO FAR</SceneTag><h2>Learning by<br /><span className="serif-italic">building together.</span></h2></div><p>Leadership means making space for others to learn, build, and give things a try.</p></div>
        <div className="timeline-list">
          <article className="timeline-item" data-build-item><div className="timeline-year">AUG 2025 — AUG 2026</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><a href={resumeLinks.chapter} target="_blank" rel="noopener noreferrer">FEU TECH ACM STUDENT CHAPTER <Arrow diagonal /></a><span>02 / LEADERSHIP</span></div><h3>Associate Director<br />for Academics</h3><p>I led review sessions, AI building workshops, and prompt-engineering programs. I helped run <a href={resumeLinks.developersWeek} target="_blank" rel="noopener noreferrer">FEU Tech Developers Week and a university hackathon</a>, advising 40+ teams. I secured 12 months of DataCamp Donates access for 200+ members.</p><div className="timeline-tags"><span>ACADEMIC PROGRAMS</span><span>COMMUNITY</span><span>EVENT LEADERSHIP</span></div></div></article>
          <article className="timeline-item" data-build-item><div className="timeline-year">AUG 2024 — AUG 2025</div><div className="timeline-marker"><i/></div><div className="timeline-content"><div className="timeline-top"><a href={resumeLinks.chapter} target="_blank" rel="noopener noreferrer">FEU TECH ACM STUDENT CHAPTER <Arrow diagonal /></a><span>01 / LEADERSHIP</span></div><h3>Junior Officer<br />for Academics</h3><p>I directed peer-led review sessions and designed a scalable structure for the chapter’s academic initiatives. I also facilitated interactive Data Science workshops for 40+ students using Google Colab.</p><div className="timeline-tags"><span>DATA SCIENCE</span><span>PEER LEARNING</span><span>GOOGLE COLAB</span></div></div></article>
        </div><div className="education-strip" data-build-item><span>EDUCATION</span><strong>FEU Institute of Technology</strong><span className="education-degree">BS Computer Science · Artificial Intelligence specialization</span><span className="education-date">AUG 2024 — PRESENT</span></div>
      </div>
    </Scene>

    <Scene id="recognition" className="recognition-scene">
      <div className="section-wrap"><div className="section-heading"><div><SceneTag n="06">RECOGNITION & LEARNING</SceneTag><h2><span className="serif-italic">Milestones</span><br />along the way.</h2></div><p className="section-intro">Scholarships, academic results, and certifications earned along the way.</p></div>
        <div className="recognition-grid"><article className="award-card award-feature" data-build-item><div className="award-symbol">✳</div><span>ACADEMIC HONOR</span><h3>President’s<br />Scholarship Award</h3><p>Highest Honors Awardee<br />100% tuition coverage · FEU Institute of Technology</p><div className="award-year">01 <span>— 2024</span></div></article><article className="award-card" data-build-item><div className="award-symbol rank-symbol">#1</div><span>TOP PERFORMING STUDENT</span><h3>Rank 1</h3><p>A.Y. 2024–2025<br />FEU Institute of Technology</p><a className="award-evidence" href={resumeLinks.rankAward} target="_blank" rel="noopener noreferrer">View award <Arrow diagonal /></a><div className="award-year">02 <span>— 2025</span></div></article><article className="award-card" data-build-item><div className="award-symbol">◎</div><span>NATIONAL SCHOLARSHIP</span><h3>DOST–SEI<br />Scholar</h3><p>Selected among 10,756 applicants<br />(12.02%)</p><a className="award-evidence" href={resumeLinks.dostResults} target="_blank" rel="noopener noreferrer">View results <Arrow diagonal /></a><div className="award-year">03 <span>— 2024</span></div></article></div>
        <div className="cert-row" data-build-item><span className="cert-label">CERTIFICATIONS</span><div>{certifications.map(({name, href})=><a className="cert-link" href={href} key={name} target="_blank" rel="noopener noreferrer">{name}<i aria-hidden="true">↗</i></a>)}</div></div>
      </div>
    </Scene>

    <section className="contact-section" id="contact"><div className="contact-glow"/><div className="contact-inner"><SceneTag n="07">NEXT, LET’S MAKE SOMETHING USEFUL</SceneTag><h2>Have a good<br />question? <span className="serif-italic">I’m in.</span></h2><p>Open to AI and data roles or collaborations. Have an idea to explore? Let’s talk.</p><button className="button button-primary email-button" data-copy-email type="button">Get in touch <Arrow /></button><div className="contact-links"><a href="mailto:18jaehyun05@gmail.com">18jaehyun05@gmail.com <Arrow diagonal /></a><a href="tel:+639279291400">+63 927 929 1400 <Arrow diagonal /></a><a href="https://www.linkedin.com/in/jae-hyun-tukushima/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a><a href="https://github.com/jaexmachine" target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a></div><div className="contact-meta"><span>MANILA, PHILIPPINES</span><span>BUILT WITH CARE · 2026</span></div></div></section>
    <footer className="footer"><a className="brand" href="#home" aria-label="Back to Jae Hyun home"><span className="brand-mark"><Image className="brand-logo brand-logo-light" src="/rocket-j-light.png" alt="" width={1280} height={1280} sizes="42px" /><Image className="brand-logo brand-logo-dark" src="/rocket-j-dark.png" alt="" width={1280} height={1280} sizes="42px" /></span><span className="brand-name">jae hyun<br/><small>PORTFOLIO / 2026</small></span></a><span>A PORTFOLIO IN PROGRESS <i>✳</i></span><a href="#home">BACK TO TOP ↑</a></footer>
  </PortfolioShell>;
}
