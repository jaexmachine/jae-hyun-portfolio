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
      { url: "/rocket-j-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/rocket-j-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Jae Hyun Tukushima — AI / Data Analyst",
    description: "AI, data, and geospatial systems, built one idea at a time.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body>{children}</body></html>;
}
