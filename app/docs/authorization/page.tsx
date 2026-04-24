import type { Metadata } from "next";
import AuthorizationContent from "@/content/docs/authorization.mdx";

export const metadata: Metadata = {
  title: "Authorization",
  description:
    "Normative specification for Flametrench authorization — relational tuples and check semantics.",
};

export default function AuthorizationPage() {
  return (
    <div className="prose-docs">
      <AuthorizationContent />
    </div>
  );
}
