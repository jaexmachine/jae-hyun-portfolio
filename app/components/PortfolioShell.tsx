"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const GravityGrid = dynamic(() => import("./GravityGrid"), { ssr: false });

type MotionApi = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

export default function PortfolioShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const sceneObserverRef = useRef<IntersectionObserver | null>(null);
  const motionApiRef = useRef<MotionApi | null>(null);
  const buildSkippedRef = useRef(false);
  const [pointerEffectsReady, setPointerEffectsReady] = useState(false);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { root.current?.classList.remove("is-initializing"); document.documentElement.classList.add("motion-ready"); return; }
    let cancelled = false;
    let sceneObserver: IntersectionObserver | undefined;
    const sceneContexts: Array<{ revert: () => void }> = [];
    let ctx: { revert: () => void } | undefined;

    const initializeMotion = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || buildSkippedRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      motionApiRef.current = { gsap, ScrollTrigger };

      ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-build-scene]");
      const initializeScene = (scene: HTMLElement) => {
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
          const heroEssentials = scene.querySelector<HTMLElement>(".hero-essentials");
          const sideNote = scene.querySelector<HTMLElement>(".hero-side-note");
          if (!headline || !art) return;

          // Measure the natural layout before the CSS-only first frame is cleared.
          root.current?.classList.remove("is-initializing");

          const details = [
            heroEssentials,
            profileTag,
            ...items.filter((item) => item !== headline && item !== heroEssentials),
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
            trigger: scene, start: "top top", end: () => `+=${Math.max(1700, window.innerHeight * 2.45)}`,
            scrub: 1.05, pin: true, pinSpacing: true, invalidateOnRefresh: true,
            onLeave: () => {
              scene.classList.add("is-built");
              gsap.set(details, { autoAlpha: 1, visibility: "visible" });
            },
          }});

          // Let the thought land first. Then move it into its editorial position
          // before rebuilding the supporting details around it.
          timeline.to(headline, { x: 0, y: 0, scale: 1, duration: 0.37, ease: "power3.inOut" }, 0)
            .set(headline, { textAlign: "left" }, 0.37);

          const buildStart = 0.40;
          const buildEnd = 0.87;
          const step = (buildEnd - buildStart) / Math.max(details.length, 1);
          timeline.to(art, { autoAlpha: 1, visibility: "visible", duration: 0.08 }, buildStart + step * 1.6);
          details.forEach((item, i) => {
            const startAt = buildStart + i * step;
            const next = details[i + 1];
            timeline.to(frame, { ...boxProps(item), autoAlpha: 0.96, scale: 1, borderColor: i % 2 ? "#d8cdb9" : "#e8ddc7", duration: step * 0.58 }, startAt);
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
          trigger: scene, start: "top top", end: () => `+=${Math.max(1450, window.innerHeight * 2.1)}`,
          scrub: 1, pin: true, pinSpacing: true, invalidateOnRefresh: true,
          onLeave: () => {
            scene.classList.add("is-built");
            gsap.set(items, { autoAlpha: 1, visibility: "visible" });
          },
        }});
        const buildStart = 0.08;
        const buildEnd = 0.80;
        const step = (buildEnd - buildStart) / items.length;
        items.forEach((item, i) => {
          const startAt = buildStart + i * step;
          const next = items[i + 1];
          const color = i % 2 ? "#d8cdb9" : "#e8ddc7";

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
      };

      const homeScene = scenes.find((scene) => scene.id === "home");
      if (homeScene) initializeScene(homeScene);

      const deferredScenes = scenes.filter((scene) => scene !== homeScene);
      if ("IntersectionObserver" in window) {
        sceneObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const scene = entry.target as HTMLElement;
            sceneObserver?.unobserve(scene);
            sceneContexts.push(gsap.context(() => initializeScene(scene), scene));
          });
        }, { rootMargin: "120% 0px" });
        sceneObserverRef.current = sceneObserver;
        deferredScenes.forEach((scene) => sceneObserver?.observe(scene));
      } else {
        deferredScenes.forEach(initializeScene);
      }

      gsap.fromTo(".ambient-orb", { y: 0 }, { y: -110, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } });
      root.current?.classList.remove("is-initializing");
      document.documentElement.classList.add("motion-ready");
      }, root);
    };

    void initializeMotion().catch(() => {
      if (cancelled) return;
      root.current?.classList.remove("is-initializing");
      document.documentElement.classList.add("motion-ready");
    });
    return () => {
      cancelled = true;
      sceneObserver?.disconnect();
      sceneObserverRef.current = null;
      sceneContexts.forEach((sceneContext) => sceneContext.revert());
      ctx?.revert();
      motionApiRef.current = null;
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);


  useEffect(() => {
    const rootElement = root.current;
    const header = rootElement?.querySelector<HTMLElement>(".topbar");
    const nav = header?.querySelector<HTMLElement>(".site-nav");
    const menuButton = header?.querySelector<HTMLButtonElement>(".mobile-menu-toggle");
    const themeButton = header?.querySelector<HTMLButtonElement>(".theme-toggle");
    const toast = rootElement?.querySelector<HTMLElement>(".toast");
    const toastMessage = toast?.querySelector<HTMLElement>(".toast-message");
    let toastTimer = 0;

    const closeMenu = () => {
      nav?.classList.remove("is-open");
      menuButton?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
    };

    const setActiveLink = (activeId: string) => {
      nav?.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((link) => {
        const active = link.hash.slice(1) === activeId;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const applyTheme = (theme: "dark" | "light") => {
      document.documentElement.dataset.theme = theme;
      if (!themeButton) return;
      const next = theme === "dark" ? "light" : "dark";
      themeButton.setAttribute("aria-label", `Switch to ${next} mode`);
      themeButton.title = `Switch to ${next} mode`;
      themeButton.setAttribute("aria-pressed", String(theme === "light"));
      const icon = themeButton.querySelector("span");
      if (icon) icon.textContent = theme === "dark" ? "☼" : "☾";
    };

    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    applyTheme(initialTheme);

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest(".theme-toggle")) {
        const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        window.localStorage.setItem("portfolio-theme", nextTheme);
        return;
      }

      if (target.closest(".mobile-menu-toggle")) {
        const open = !nav?.classList.contains("is-open");
        nav?.classList.toggle("is-open", open);
        menuButton?.classList.toggle("is-open", open);
        menuButton?.setAttribute("aria-expanded", String(open));
        menuButton?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        return;
      }

      const navLink = target.closest<HTMLAnchorElement>(".site-nav a[href^='#']");
      if (navLink) {
        setActiveLink(navLink.hash.slice(1));
        closeMenu();
        return;
      }

      if (target.closest("[data-skip-build]")) {
        buildSkippedRef.current = true;
        sceneObserverRef.current?.disconnect();
        sceneObserverRef.current = null;
        const motion = motionApiRef.current;
        motion?.ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
        if (motion) {
          motion.gsap.set("[data-build-item]", { autoAlpha: 1, visibility: "visible", clearProps: "filter,transform" });
          motion.gsap.set(".edit-selection,.builder-cursor", { autoAlpha: 0 });
        } else {
          rootElement?.querySelectorAll<HTMLElement>(".edit-selection,.builder-cursor").forEach((element) => {
            element.style.opacity = "0";
          });
        }
        rootElement?.classList.remove("is-initializing");
        document.documentElement.classList.add("motion-ready");
        document.querySelector("#research")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (target.closest("[data-copy-email]")) {
        void navigator.clipboard.writeText("18jaehyun05@gmail.com").then(() => {
          if (!toast) return;
          if (toastMessage) toastMessage.textContent = "Email copied to clipboard";
          toast.classList.add("show");
          window.clearTimeout(toastTimer);
          toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
        }).catch(() => { window.location.href = "mailto:18jaehyun05@gmail.com"; });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    let lastToggleY = window.scrollY;
    let navHidden = header?.classList.contains("is-hidden") ?? false;
    const setNavHidden = (hidden: boolean) => {
      if (hidden === navHidden) return;
      navHidden = hidden;
      header?.classList.toggle("is-hidden", hidden);
      if (hidden) closeMenu();
    };
    const updateNav = () => {
      const y = window.scrollY;
      if (y < 100) {
        setNavHidden(false);
        closeMenu();
        lastToggleY = y;
      } else if (y > lastToggleY + 18) {
        setNavHidden(true);
        lastToggleY = y;
      } else if (y < lastToggleY - 18) {
        setNavHidden(false);
        lastToggleY = y;
      }
    };

    const sections = ["research", "about", "experience", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const navObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2) - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2))[0];
      if (current) setActiveLink(current.target.id);
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0 });
    sections.forEach((section) => navObserver.observe(section));

    const supportsHover = window.matchMedia("(any-hover: hover)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enablePointerEffects = () => setPointerEffectsReady(true);
    if (supportsHover && !prefersReducedMotion) {
      window.addEventListener("pointermove", enablePointerEffects, { once: true, passive: true });
    }

    updateNav();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", updateNav, { passive: true });

    return () => {
      window.clearTimeout(toastTimer);
      navObserver.disconnect();
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", updateNav);
      window.removeEventListener("pointermove", enablePointerEffects);
    };
  }, []);

  return <main ref={root} className="is-initializing">
    {pointerEffectsReady && <GravityGrid />}
    <div className="ambient-orb orb-a" /><div className="ambient-orb orb-b" />
    {children}
    <button className="skip-build" data-skip-build type="button" aria-label="Skip the build animation">Skip build <span>↗</span></button>
    <div className="toast" role="status" aria-live="polite"><span className="toast-message" /><span aria-hidden="true">✓</span></div>
    {pointerEffectsReady && <CustomCursor />}
  </main>;
}
