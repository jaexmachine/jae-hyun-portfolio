"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DesktopMotionRuntime = dynamic(() => import("./DesktopMotionRuntime"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const GravityGrid = dynamic(() => import("./GravityGrid"), { ssr: false });

export default function PortfolioRuntime() {
  const [desktopMotionReady, setDesktopMotionReady] = useState(false);
  const [pointerEffectsReady, setPointerEffectsReady] = useState(false);

  useEffect(() => {
    const fineMotion = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const updateMotion = () => setDesktopMotionReady(fineMotion.matches);
    updateMotion();
    fineMotion.addEventListener("change", updateMotion);
    return () => fineMotion.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const rootElement = document.querySelector<HTMLElement>("main");
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
        rootElement?.setAttribute("data-build-skipped", "true");
        rootElement?.classList.remove("is-initializing");
        rootElement?.querySelectorAll<HTMLElement>(".edit-selection,.builder-cursor").forEach((element) => {
          element.style.opacity = "0";
        });
        document.documentElement.classList.add("motion-ready");
        window.dispatchEvent(new Event("portfolio:skip-build"));
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

    const supportsHover = window.matchMedia("(pointer: fine) and (any-hover: hover)").matches;
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

  return <>
    {desktopMotionReady && <DesktopMotionRuntime />}
    {pointerEffectsReady && <GravityGrid />}
    {pointerEffectsReady && <CustomCursor />}
  </>;
}
