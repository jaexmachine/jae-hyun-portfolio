import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jae Hyun Tukushima — AI / Data Analyst",
  description: "A portfolio assembled in real time. Jae Hyun Tukushima — AI, data, and geospatial systems.",
  icons: {
    icon: [
      { url: "/rocket-j-light-icon.png", type: "image/png", sizes: "128x128", media: "(prefers-color-scheme: light)" },
      { url: "/rocket-j-dark-icon.png", type: "image/png", sizes: "128x128", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Jae Hyun Tukushima — AI / Data Analyst",
    description: "AI, data, and geospatial systems, built one idea at a time.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body>
    <noscript><style>{`main.is-initializing #home .hero-copy h1{position:static;inset:auto;left:auto;top:auto;display:block;height:auto;width:auto;transform:none;text-align:left;max-width:none}main.is-initializing #home .hero-essentials,main.is-initializing #home .hero-footnote,main.is-initializing #home .hero-art,main.is-initializing #home .hero-side-note,main.is-initializing #home .edit-selection,main.is-initializing #home .builder-cursor,main.is-initializing #home .scene-progress{visibility:visible!important;opacity:1!important}`}</style></noscript>
    {children}
  </body></html>;
}
