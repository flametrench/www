import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const siteOpenGraph: OpenGraph = {
  title: "Flametrench",
  description:
    "An open specification and SDK family for identity, tenancy, and authorization.",
  url: "/",
  siteName: "Flametrench",
  type: "website",
  images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Flametrench — Backbone infrastructure for applications",
    },
  ],
};

// A page that sets `openGraph` replaces the layout's object wholesale
// (Next merges metadata shallowly), so spread the site defaults to keep
// the image. Paths carry the trailing slash the site serves them with.
export function pageOpenGraph(path: string): OpenGraph {
  return { ...siteOpenGraph, url: path };
}
