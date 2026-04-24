import type { Metadata } from "next";
import IdentityContent from "@/content/docs/identity.mdx";

export const metadata: Metadata = {
  title: "Identity",
  description:
    "Normative specification for Flametrench identity — users, credentials, sessions.",
};

export default function IdentityPage() {
  return (
    <div className="prose-docs">
      <IdentityContent />
    </div>
  );
}
