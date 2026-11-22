import type { ReactNode } from "react";

export default function ProjectDisclosure({ id, children }: { id: string; children: ReactNode }) {
  return <details className="project-disclosure">
    <summary className="see-more-button inline-flex items-center gap-2 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
      <span className="disclosure-label-closed">See more</span>
      <span className="disclosure-label-open">See less</span>
      <span className="disclosure-icon" aria-hidden="true">↗</span>
    </summary>
    <div className="project-extra" id={`${id}-details`}>
      <div className="project-extra-inner">{children}</div>
    </div>
  </details>;
}
