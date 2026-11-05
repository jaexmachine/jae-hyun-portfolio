import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Jae Hyun Tukushima — AI / Data Analyst",
  description: "A portfolio assembled in real time. Jae Hyun Tukushima — AI, data, and geospatial systems.",
  openGraph: {
    title: "Jae Hyun Tukushima — AI / Data Analyst",
    description: "AI, data, and geospatial systems, built one idea at a time.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
