import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteOpenGraph } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flametrench — Backbone infrastructure for applications",
    template: "%s — Flametrench",
  },
  description:
    "An open specification and SDK family for identity, tenancy, and authorization. Byte-identical semantics across PHP and Node. Apache 2.0.",
  metadataBase: new URL("https://www.flametrench.dev"),
  openGraph: siteOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: "Flametrench",
    description:
      "An open specification and SDK family for identity, tenancy, and authorization.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Flametrench — Backbone infrastructure for applications",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
