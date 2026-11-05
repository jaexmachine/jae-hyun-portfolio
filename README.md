<div align="center">

<img src="public/repo-preview.svg" alt="Jae Hyun Tukushima portfolio preview" width="100%" />

# Jae Hyun Tukushima · Portfolio

### A portfolio that assembles itself as you scroll.

An interactive portfolio about AI, data, and geospatial systems — built as a sequence of calm, cinematic editing moments.

<p>
  <a href="https://github.com/jaexmachine/jae-hyun-portfolio"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-111719?style=flat-square&logo=nextdotjs&logoColor=white"></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="GSAP ScrollTrigger" src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square&logo=greensock&logoColor=111719">
  <img alt="Responsive" src="https://img.shields.io/badge/Responsive-Yes-9AF0D4?style=flat-square&logoColor=111719">
</p>

<p><a href="#experience">Explore the experience</a> · <a href="#getting-started">Run it locally</a> · <a href="#accessibility">Accessibility</a></p>

</div>

---

## The idea

The page is its own canvas. Scroll to watch the headline find its place, then see each portfolio section appear under a simulated editor’s cursor. Scroll back to reverse the sequence. When a section is complete, it settles into a readable portfolio before the page continues.

## Experience

| Moment | What happens |
| --- | --- |
| **The opening** | “Making sense of what’s next.” starts alone at the center, then glides into its final layout. |
| **The build** | A measured selection frame moves across real page elements. Each detail appears while it is selected. |
| **The reveal** | The finished section comes together before the pinned scroll releases. |
| **The return** | Scrolling upward scrubs the same sequence backward. |

The rest of the portfolio tells Jae’s story through ongoing coastal subsidence research, data and automation projects, FEU Tech ACM leadership, academic honors, and technical skills.

## Built with

- **Next.js + React** for the portfolio app
- **TypeScript** for the interface and interaction logic
- **GSAP ScrollTrigger** for pinned, reversible scroll timelines
- **Custom CSS** for the visual system, responsive layouts, and microinteractions

## Getting started

### Requirements

- Node.js 20.9 or newer
- npm

### Install and run

```bash
git clone https://github.com/jaexmachine/jae-hyun-portfolio.git
cd jae-hyun-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful commands

```bash
npm run dev       # Start the local preview
npm run build     # Create an optimized production build
npm run start     # Serve the production build
npm run typecheck # Check TypeScript types
```

Development uses `.next-dev/`; production builds use `.next/`, so the two can run without overwriting each other’s assets.

## Accessibility

- Reduced-motion preferences skip the scroll choreography and keep every detail visible.
- **Skip build** jumps past the construction sequence.
- Navigation uses regular links and the page remains usable with a keyboard.
- The content is real HTML, not text baked into an image.

## Project structure

```text
app/
  layout.tsx       # Page metadata and global styles
  page.tsx         # Portfolio content and scroll sequences
  styles.css       # Visual system and responsive behavior
public/
  repo-preview.svg # Repository cover art
```

## About

**Jae Hyun Tukushima** is an AI / Data Analyst and Computer Science student specializing in Artificial Intelligence at FEU Institute of Technology.

- [LinkedIn](https://www.linkedin.com/in/jae-hyun-tukushima/)
- [GitHub](https://github.com/jaexmachine)
- [Email](mailto:18jaehyun05@gmail.com)

---

<div align="center">

*An open-ended work in progress.*

</div>
