import type { Metadata } from "next";
import IdentityContent from "@/content/docs/identity.mdx";
import { pageOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Identity",
  description:
    "Normative specification for Flametrench identity — users, credentials, sessions.",
  openGraph: pageOpenGraph("/docs/identity/"),
};

export default function IdentityPage() {
  return (
    <div className="prose-docs">
      <IdentityContent />
    </div>
  );
}
