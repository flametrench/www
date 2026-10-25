import type { Metadata } from "next";
import TenancyContent from "@/content/docs/tenancy.mdx";
import { pageOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Tenancy",
  description:
    "Normative specification for Flametrench tenancy — organizations, memberships, invitations.",
  openGraph: pageOpenGraph("/docs/tenancy/"),
};

export default function TenancyPage() {
  return (
    <div className="prose-docs">
      <TenancyContent />
    </div>
  );
}
