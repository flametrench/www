import type { Metadata } from "next";
import TenancyContent from "@/content/docs/tenancy.mdx";

export const metadata: Metadata = {
  title: "Tenancy",
  description:
    "Normative specification for Flametrench tenancy — organizations, memberships, invitations.",
};

export default function TenancyPage() {
  return (
    <div className="prose-docs">
      <TenancyContent />
    </div>
  );
}
