"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ProjectDisclosure({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (window.matchMedia("(pointer: coarse)").matches) return;
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
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
