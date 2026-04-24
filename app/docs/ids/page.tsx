import type { Metadata } from "next";
import IdsContent from "@/content/docs/ids.mdx";

export const metadata: Metadata = {
  title: "Identifier format",
  description:
    "Normative specification for Flametrench wire-format identifiers.",
};

export default function IdsSpecPage() {
  return (
    <div className="prose-docs">
      <IdsContent />
    </div>
  );
}
