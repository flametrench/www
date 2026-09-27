import type { Metadata } from "next";
import IdsContent from "@/content/docs/ids.mdx";
import { pageOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Identifier format",
  description:
    "Normative specification for Flametrench wire-format identifiers.",
  openGraph: pageOpenGraph("/docs/ids/"),
};

export default function IdsSpecPage() {
  return (
    <div className="prose-docs">
      <IdsContent />
    </div>
  );
}
