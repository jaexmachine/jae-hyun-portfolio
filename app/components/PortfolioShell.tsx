import type { ReactNode } from "react";
import PortfolioRuntime from "./PortfolioRuntime";

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return <main className="is-initializing">
    <div className="ambient-orb orb-a" />
    <div className="ambient-orb orb-b" />
    {children}
    <button className="skip-build" data-skip-build type="button" aria-label="Skip the build animation">Skip build <span>↗</span></button>
    <div className="toast" role="status" aria-live="polite"><span className="toast-message" /><span aria-hidden="true">✓</span></div>
    <PortfolioRuntime />
  </main>;
}
