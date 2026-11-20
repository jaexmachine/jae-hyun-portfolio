"use client";

import { useEffect, useRef } from "react";

function GravityGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const main = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    if (!canvas || !main || !context || reduceMotion.matches || coarsePointer.matches) return;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, present: false, pressed: false, pressedAt: 0 };
    let width = 0;
    let height = 0;
    let radius = 0;
    let depth = 0;
    let frame = 0;
    let gridColor = "rgba(244,234,214,.045)";
    let glowColor = "rgba(244,234,214,.035)";
    let warpedX = 0;
    let warpedY = 0;
    const pitch = 58;
    const sampleStep = 26;

    const updateColors = () => {
      const styles = getComputedStyle(canvas);
      gridColor = styles.getPropertyValue("--gravity-grid").trim() || gridColor;
      glowColor = styles.getPropertyValue("--gravity-glow").trim() || glowColor;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const warpPoint = (x: number, y: number, activeRadius: number, activeDepth: number) => {
      warpedX = x;
      warpedY = y;
      if (!pointer.present || activeRadius < 1 || activeDepth < 0.1) return;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;
      const radiusSquared = activeRadius * activeRadius;
      if (distanceSquared < 0.01 || distanceSquared > radiusSquared * 4) return;
      const distance = Math.sqrt(distanceSquared);
      const falloff = Math.exp(-distanceSquared / (radiusSquared * 0.42));
      const pull = activeDepth * falloff * Math.min(distance / (pitch * 1.2), 1);
      warpedX = x - (dx / distance) * pull;
      warpedY = y - (dy / distance) * pull;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const gridActive = pointer.present;
      const activeRadius = gridActive ? radius : 0;
      const activeDepth = gridActive ? depth : 0;
      context.beginPath();
      for (let x = 0; x <= width + pitch; x += pitch) {
        for (let y = -pitch; y <= height + pitch; y += sampleStep) {
          warpPoint(x, y, activeRadius, activeDepth);
          if (y === -pitch) context.moveTo(warpedX, warpedY);
          else context.lineTo(warpedX, warpedY);
        }
      }
      for (let y = 0; y <= height + pitch; y += pitch) {
        for (let x = -pitch; x <= width + pitch; x += sampleStep) {
          warpPoint(x, y, activeRadius, activeDepth);
          if (x === -pitch) context.moveTo(warpedX, warpedY);
          else context.lineTo(warpedX, warpedY);
        }
      }
      context.strokeStyle = gridColor;
      context.lineWidth = 1;
      context.stroke();

      if (gridActive && radius > 0) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 0.9);
        glow.addColorStop(0, glowColor);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = glow;
        context.fillRect(pointer.x - radius, pointer.y - radius, radius * 2, radius * 2);
      }

    };

    const tick = (now: number) => {
      frame = 0;
      const easing = 0.16;
      pointer.x += (pointer.targetX - pointer.x) * 0.2;
      pointer.y += (pointer.targetY - pointer.y) * 0.2;

      const hold = pointer.pressed ? Math.max(0, Math.min((now - pointer.pressedAt - 380) / 1150, 1)) : 0;
      const lensReveal = hold * hold * (3 - 2 * hold);
      const targetRadius = pointer.present ? 142 + (pointer.pressed ? lensReveal * 65 : 0) : 0;
      const targetDepth = pointer.present ? 14 + (pointer.pressed ? lensReveal * 30 : 0) : 0;
      radius += (targetRadius - radius) * easing;
      depth += (targetDepth - depth) * easing;
      draw();

      const moving = Math.abs(pointer.targetX - pointer.x) + Math.abs(pointer.targetY - pointer.y) > 0.35;
      const settling = Math.abs(targetRadius - radius) + Math.abs(targetDepth - depth) > 0.25;
      if (pointer.pressed || moving || settling) frame = requestAnimationFrame(tick);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.present = true;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      schedule();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.present = true;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.pressed = true;
      pointer.pressedAt = performance.now();
      schedule();
    };
    const release = () => {
      pointer.pressed = false;
      pointer.pressedAt = 0;
      schedule();
    };
    const leave = () => {
      pointer.pressed = false;
      pointer.pressedAt = 0;
      pointer.present = false;
      schedule();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        pointer.pressed = false;
        pointer.pressedAt = 0;
      } else schedule();
    };
    const onThemeChange = () => { updateColors(); schedule(); };
    const observer = new MutationObserver(onThemeChange);

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    window.addEventListener("blur", leave);
    window.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    main.setAttribute("data-gravity-ready", "true");
    updateColors();
    resize();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      main.removeAttribute("data-gravity-ready");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", leave);
      window.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="gravity-grid" aria-hidden="true" />;
}

export default GravityGrid;

