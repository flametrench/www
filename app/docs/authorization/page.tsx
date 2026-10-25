import type { Metadata } from "next";
import AuthorizationContent from "@/content/docs/authorization.mdx";
import { pageOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Authorization",
  description:
    "Normative specification for Flametrench authorization — relational tuples and check semantics.",
  openGraph: pageOpenGraph("/docs/authorization/"),
};

export default function AuthorizationPage() {
  return (
    <div className="prose-docs">
      <AuthorizationContent />
    </div>
  );
}
