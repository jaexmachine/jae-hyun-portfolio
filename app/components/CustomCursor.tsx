"use client";

import { useEffect, useRef } from "react";

function CustomCursor() {
  const starRef = useRef<HTMLSpanElement>(null);
  const rocketRef = useRef<HTMLSpanElement>(null);
  const cloudRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const star = starRef.current;
    const rocket = rocketRef.current;
    if (!star || !rocket) return;

    const root = document.documentElement;
    const clouds = cloudRefs.current.filter((puff): puff is HTMLSpanElement => puff !== null);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const position = { x: -100, y: -100 };
    const rocketPosition = { x: -140, y: -100, angle: 0, angleVelocity: 0 };
    const cloudParticles = clouds.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 0, opacity: 0, active: false }));
    const cursor = star.closest<HTMLElement>(".custom-cursor");
    if (!cursor) return;
    clouds.forEach((puff, index) => {
      puff.style.width = `${10 + index * 2}px`;
      puff.style.height = `${7 + index * 1.4}px`;
    });
    let pointerSpeed = 0;
    let horizontalDirection = 1;
    let lastMoveAt = 0;
    let movementStartedAt = 0;
    let wasMoving = false;
    let adjustmentStartedAt = 0;
    let hasAdjustedOnCatchup = false;
    let initialized = false;
    let pointerPresent = false;
    let active = false;
    let frame = 0;
    let hideTimer = 0;
    let nextCloud = 0;
    let cloudEmissionAt = 0;
    let emittedCloudCount = 0;
    let previousFrameAt = 0;
    let pointerPressedAt = 0;
    let releaseTimer = 0;
    let scrollDirection: "up" | "down" = "up";
    let scrollUntil = 0;
    let lastScrollY = window.scrollY;

    const hideCursor = () => {
      active = false;
      pointerPresent = false;
      cursor.setAttribute("data-visible", "false");
      cursor.setAttribute("data-pointer-present", "false");
      cursor.setAttribute("data-hover", "false");
      cursor.setAttribute("data-pressed", "false");
      cursor.setAttribute("data-engine-active", "false");
      cursor.setAttribute("data-adjusting", "false");
      cursor.setAttribute("data-correction-phase", "none");
      cursor.setAttribute("data-scrolling", "false");
      cursor.setAttribute("data-entry-phase", "none");
      cursor.setAttribute("data-blackhole-entry", "false");
      window.clearTimeout(releaseTimer);
      releaseTimer = 0;
      root.classList.remove("has-custom-cursor");
      initialized = false;
      wasMoving = false;
      pointerSpeed = 0;
      movementStartedAt = 0;
      adjustmentStartedAt = 0;
      hasAdjustedOnCatchup = false;
      cloudParticles.forEach((particle, index) => {
        particle.active = false;
        particle.opacity = 0;
        clouds[index].style.opacity = "0";
      });
      nextCloud = 0;
      cloudEmissionAt = 0;
      previousFrameAt = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const pauseCursor = () => {
      window.clearTimeout(hideTimer);
      active = false;
      pointerPresent = false;
      cursor.setAttribute("data-visible", "true");
      cursor.setAttribute("data-pointer-present", "false");
      cursor.setAttribute("data-hover", "false");
      cursor.setAttribute("data-pressed", "false");
      cursor.setAttribute("data-entry-phase", "none");
      cursor.setAttribute("data-blackhole-entry", "false");
      window.clearTimeout(releaseTimer);
      releaseTimer = 0;
      cursor.setAttribute("data-engine-active", "false");
      root.classList.remove("has-custom-cursor");
      wasMoving = false;
      pointerSpeed = 0;
      movementStartedAt = 0;
      lastMoveAt = 0;
      rocketPosition.angleVelocity = 0;
      adjustmentStartedAt = performance.now();
      hasAdjustedOnCatchup = true;
      cursor.setAttribute("data-adjusting", reducedMotion ? "false" : "true");
      cursor.setAttribute("data-correction-phase", reducedMotion ? "none" : "right");
      active = true;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const easeCorrection = (value: number) => {
      const t = Math.max(0, Math.min(1, value));
      return t * t * t * (t * (t * 6 - 15) + 10);
    };

    const tick = () => {
      if (!active) { frame = 0; return; }
      const now = performance.now();
      const delta = previousFrameAt ? Math.min((now - previousFrameAt) / 1000, 0.06) : 1 / 60;
      previousFrameAt = now;
      const scrollBoosting = !reducedMotion && now < scrollUntil;
      const pointerMoving = now - lastMoveAt < 200;
      const blackHolePressed = cursor.getAttribute("data-pressed") === "true";
      const entryElapsed = pointerPressedAt ? Math.max(0, now - pointerPressedAt - 380) : 0;
      const entryProgress = !blackHolePressed ? 0 : reducedMotion ? 1 : easeCorrection(Math.min(entryElapsed / 1150, 1));
      const entryCurve = Math.sin(entryProgress * Math.PI) * 9 * horizontalDirection;
      const engineActive = pointerMoving && movementStartedAt > 0 && now - movementStartedAt >= 175;
      if (pointerMoving && pointerSpeed > 0.4) wasMoving = true;
      else if (wasMoving) { wasMoving = false; pointerSpeed = 0; movementStartedAt = 0; }
      const followDelayActive = !reducedMotion && pointerMoving && movementStartedAt > 0 && now - movementStartedAt < 165;
      const cursorGap = Math.hypot(position.x - rocketPosition.x, position.y + 21 - rocketPosition.y);
      if (pointerPresent && !blackHolePressed) {
        if (cursorGap > 48) {
          hasAdjustedOnCatchup = false;
          adjustmentStartedAt = 0;
        } else if (!reducedMotion && !hasAdjustedOnCatchup && cursorGap < 26) {
          hasAdjustedOnCatchup = true;
          adjustmentStartedAt = now;
        }
      } else if (blackHolePressed) {
        adjustmentStartedAt = 0;
        hasAdjustedOnCatchup = true;
      }
      const underCursor = cursorGap < 26;
      const settleTime = adjustmentStartedAt ? now - adjustmentStartedAt : 1000;
      const upright = 0;
      const adjusting = !reducedMotion && adjustmentStartedAt > 0 && settleTime < 1100;
      const correctionPhase = !adjusting ? "none" : settleTime < 360 ? "right" : settleTime < 720 ? "left" : "settle";
      const correctionProgress = Math.min(settleTime / 1100, 1);
      const rightEnd = 360 / 1100;
      const leftEnd = 720 / 1100;
      const correctionAngle = !adjusting ? 0 : correctionProgress < rightEnd
        ? 0.31 * easeCorrection(correctionProgress / rightEnd)
        : correctionProgress < leftEnd
          ? 0.31 - 0.49 * easeCorrection((correctionProgress - rightEnd) / (leftEnd - rightEnd))
          : -0.18 + 0.18 * easeCorrection((correctionProgress - leftEnd) / (1 - leftEnd));
      const correctionOffset = !adjusting ? 0 : correctionProgress < rightEnd
        ? 8 * easeCorrection(correctionProgress / rightEnd)
        : correctionProgress < leftEnd
          ? 8 - 11 * easeCorrection((correctionProgress - rightEnd) / (leftEnd - rightEnd))
          : -3 + 3 * easeCorrection((correctionProgress - leftEnd) / (1 - leftEnd));
      const visualCorrectionPhase = horizontalDirection < 0
        ? correctionPhase === "right" ? "left" : correctionPhase === "left" ? "right" : correctionPhase
        : correctionPhase;
      const entryAngle = Math.atan2(position.y - rocketPosition.y, position.x + entryCurve - rocketPosition.x) + Math.PI / 2;
      const targetAngle = scrollBoosting
        ? scrollDirection === "down" ? Math.PI : upright
        : entryProgress > 0.03 && entryProgress < 0.96
        ? entryAngle
        : entryProgress >= 0.96
        ? upright
        : !pointerPresent
        ? upright + correctionAngle * horizontalDirection
        : pointerMoving || !underCursor ? Math.atan2(position.y - rocketPosition.y, position.x - rocketPosition.x) + Math.PI / 2 : upright;
      const horizontalCorrection = reducedMotion ? 0 : correctionOffset * horizontalDirection;
      const targetX = !pointerPresent || followDelayActive ? rocketPosition.x : position.x + horizontalCorrection + entryCurve;
      const targetY = !pointerPresent || followDelayActive ? rocketPosition.y : position.y + 21 * (1 - entryProgress);
      const distanceX = targetX - rocketPosition.x;
      const distanceY = targetY - rocketPosition.y;
      const distance = Math.hypot(distanceX, distanceY);
      if (reducedMotion) {
        rocketPosition.x += distanceX * 0.46;
        rocketPosition.y += distanceY * 0.46;
      } else if (followDelayActive) {
        // Hold position briefly before starting the follow.
      } else {
        const followSpeed = 190 + Math.min(cursorGap * 0.75, 410);
        const followStep = Math.min(distance, followSpeed * delta);
        if (distance > 0) {
          rocketPosition.x += distanceX / distance * followStep;
          rocketPosition.y += distanceY / distance * followStep;
        }
      }

      const angleDifference = Math.atan2(Math.sin(targetAngle - rocketPosition.angle), Math.cos(targetAngle - rocketPosition.angle));
      if (reducedMotion) rocketPosition.angle += angleDifference * 0.42;
      else {
        rocketPosition.angleVelocity = (rocketPosition.angleVelocity + angleDifference * 0.12) * 0.73;
        rocketPosition.angle += rocketPosition.angleVelocity;
      }
      cursor.setAttribute("data-adjusting", adjusting ? "true" : "false");
      cursor.setAttribute("data-engine-active", engineActive ? "true" : "false");
      cursor.setAttribute("data-blackhole-entry", entryProgress > 0.02 ? "true" : "false");
      const releasingFromSwirl = !blackHolePressed && releaseTimer !== 0;
      cursor.setAttribute("data-entry-phase", releasingFromSwirl ? "release" : entryProgress > 0.36 ? "swirl" : entryProgress > 0.02 ? "approach" : "none");
      cursor.setAttribute("data-entry-side", horizontalDirection < 0 ? "left" : "right");
      cursor.setAttribute("data-correction-phase", visualCorrectionPhase);
      cursor.setAttribute("data-scrolling", scrollBoosting ? "true" : "false");
      cursor.setAttribute("data-scroll-direction", scrollDirection);
      rocket.style.transform = `translate3d(${rocketPosition.x - 12}px, ${rocketPosition.y - 12}px, 0) rotate(${rocketPosition.angle}rad)`;

      const tailX = -Math.sin(rocketPosition.angle);
      const tailY = Math.cos(rocketPosition.angle);
      const engineX = rocketPosition.x + tailX * 14;
      const engineY = rocketPosition.y + tailY * 14;
      const correctionSide = visualCorrectionPhase === "right" ? 1 : visualCorrectionPhase === "left" ? -1 : 0;
      const emissionPeriod = scrollBoosting ? 54 : engineActive ? 68 : adjusting && correctionSide !== 0 ? 82 : 0;
      if (!reducedMotion && emissionPeriod && now - cloudEmissionAt >= emissionPeriod) {
        const index = nextCloud;
        const particle = cloudParticles[index];
        const jitter = ((emittedCloudCount % 3) - 1) * 1.4;
        const sideX = Math.cos(rocketPosition.angle);
        const sideY = Math.sin(rocketPosition.angle);
        particle.x = engineX + sideX * correctionSide * 7;
        particle.y = engineY + sideY * correctionSide * 7;
        particle.vx = tailX * 0.55 + sideX * correctionSide * 0.35 + jitter * 0.12;
        particle.vy = tailY * 0.55 + sideY * correctionSide * 0.35 + jitter * 0.08;
        particle.age = 0;
        particle.life = correctionSide ? 0.72 : scrollBoosting ? 0.62 : 0.82;
        particle.size = scrollBoosting ? 12 + (emittedCloudCount % 3) * 2 : 9 + (emittedCloudCount % 4) * 2;
        particle.opacity = scrollBoosting ? 0.82 : correctionSide ? 0.72 : 0.62;
        particle.active = true;
        clouds[index].style.width = `${particle.size}px`;
        clouds[index].style.height = `${particle.size * 0.72}px`;
        nextCloud = (nextCloud + 1) % clouds.length;
        emittedCloudCount += 1;
        cloudEmissionAt = now;
      }

      let cloudsAnimating = false;
      cloudParticles.forEach((particle, index) => {
        if (!particle.active) return;
        particle.age += delta;
        const age = particle.age / particle.life;
        if (age >= 1) {
          particle.active = false;
          clouds[index].style.opacity = "0";
          return;
        }
        const drift = delta * 60;
        particle.x += particle.vx * drift;
        particle.y += particle.vy * drift;
        particle.vx *= Math.pow(0.96, drift);
        particle.vy *= Math.pow(0.96, drift);
        const opacity = particle.opacity * Math.pow(1 - age, 1.35);
        const scale = 0.7 + age * 1.15;
        clouds[index].style.transform = `translate3d(${particle.x - particle.size / 2}px, ${particle.y - particle.size * 0.36}px, 0) scale(${scale})`;
        clouds[index].style.opacity = `${opacity}`;
        cloudsAnimating = true;
      });

      const rocketStillMoving = distance > 0.7 || Math.abs(angleDifference) > 0.02 || Math.abs(rocketPosition.angleVelocity) > 0.005;
      const waitingForIgnition = pointerMoving && !engineActive;
      const blackHoleEntering = blackHolePressed && entryProgress < 1;
      if (pointerMoving || scrollBoosting || cloudsAnimating || rocketStillMoving || adjusting || waitingForIgnition || blackHoleEntering) frame = requestAnimationFrame(tick);
      else frame = 0;
    };

    const onScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (Math.abs(scrollDelta) < 1) return;
      scrollDirection = scrollDelta > 0 ? "down" : "up";
      scrollUntil = performance.now() + 180;
      cursor.setAttribute("data-scroll-direction", scrollDirection);
      cursor.setAttribute("data-scrolling", reducedMotion ? "false" : "true");
      if (cursor.getAttribute("data-visible") === "true") {
        active = true;
        if (!frame) frame = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      const element = target instanceof Element ? target : null;
      const textEntry = element?.closest("input, textarea, select, [contenteditable='true']");
      if (textEntry && (event.pointerType === "mouse" || event.pointerType === "pen")) {
        hideCursor();
        return;
      }

      window.clearTimeout(hideTimer);
      if (event.pointerType === "mouse" || event.pointerType === "pen") root.classList.add("has-custom-cursor");
      pointerPresent = true;
      adjustmentStartedAt = 0;
      if (!initialized) {
        rocketPosition.x = event.clientX - 42;
        rocketPosition.y = event.clientY + 24;
        rocketPosition.angle = 0;
        rocketPosition.angleVelocity = 0;
        initialized = true;
      } else {
        const movementX = event.clientX - position.x;
        const movementY = event.clientY - position.y;
        const movement = Math.hypot(movementX, movementY);
        if (movement > 0.2) {
          const now = performance.now();
          if (!wasMoving || now - lastMoveAt > 200) movementStartedAt = now;
          if (Math.abs(movementX) > 0.2) horizontalDirection = Math.sign(movementX);
          pointerSpeed = movement;
          wasMoving = true;
        }
      }

      position.x = event.clientX;
      position.y = event.clientY;
      lastMoveAt = performance.now();
      active = true;
      cursor.setAttribute("data-visible", "true");
      cursor.setAttribute("data-pointer-present", "true");
      cursor.setAttribute("data-hover", element?.closest("a, button, [role='button']") ? "true" : "false");
      cursor.setAttribute("data-adjusting", "false");
      cursor.setAttribute("data-correction-phase", "none");
      star.style.transform = `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`;

      if (!frame) frame = requestAnimationFrame(tick);
      if (event.pointerType === "touch") hideTimer = window.setTimeout(hideCursor, 700);
    };

    const onPointerDown = (event: PointerEvent) => {
      onPointerMove(event);
      window.clearTimeout(releaseTimer);
      releaseTimer = 0;
      pointerPressedAt = performance.now();
      cursor.setAttribute("data-entry-phase", "none");
      cursor.setAttribute("data-pressed", "true");
    };
    const onPointerUp = (event: PointerEvent) => {
      window.clearTimeout(hideTimer);
      const wasSwirling = cursor.getAttribute("data-entry-phase") === "swirl";
      pointerPressedAt = 0;
      cursor.setAttribute("data-entry-phase", wasSwirling ? "release" : "none");
      cursor.setAttribute("data-pressed", "false");
      if (wasSwirling) {
        releaseTimer = window.setTimeout(() => {
          cursor.setAttribute("data-entry-phase", "none");
          releaseTimer = 0;
        }, 760);
      }
      active = true;
      if (!frame) frame = requestAnimationFrame(tick);
      if (event.pointerType === "touch") hideTimer = window.setTimeout(hideCursor, 900);
    };
    const onPointerLeave = () => { if (pointerPresent) pauseCursor(); };
    const onWindowMouseOut = (event: MouseEvent) => { if (!event.relatedTarget) onPointerLeave(); };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("mouseout", onWindowMouseOut);

    return () => {
      window.clearTimeout(hideTimer);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("mouseout", onWindowMouseOut);
    };
  }, []);

  return <div className="custom-cursor" aria-hidden="true" data-visible="false" data-pointer-present="false" data-hover="false" data-pressed="false" data-adjusting="false" data-engine-active="false" data-scrolling="false" data-scroll-direction="up" data-correction-phase="none">
    {Array.from({ length: 14 }, (_, index) => <span className="rocket-cloud-puff" key={index} ref={(node) => { cloudRefs.current[index] = node; }} />)}
    <span className="cursor-star" ref={starRef}><svg viewBox="0 0 12 12"><path d="M6 0.5 7.35 4.65 11.5 6 7.35 7.35 6 11.5 4.65 7.35.5 6 4.65 4.65 6 .5Z" /></svg><span className="cursor-blackhole"><i className="blackhole-ring"/><i className="blackhole-disk"/><i className="blackhole-core"/><i className="blackhole-swirl"/></span></span>
    <span className="cursor-rocket" ref={rocketRef}><svg viewBox="0 0 28 28"><path className="rocket-fin" d="M9 13.5 4.5 20.5 9 19.3ZM19 13.5l4.5 7-4.5-1.2Z"/><path className="rocket-correction-jet" d="M8.8 15.5 6.3 18.5l2.6-.8Zm10.4 0 2.5 3-2.6-.8Z"/><path className="rocket-body" d="M14 2C10 5.6 8.5 10.5 8.5 17v2h11v-2C19.5 10.5 18 5.6 14 2Z"/><circle className="rocket-window" cx="14" cy="10.5" r="2.1"/><path className="rocket-flame" d="M11 19 14 26 17 19Z"/></svg></span>
  </div>;
}

export default CustomCursor;

