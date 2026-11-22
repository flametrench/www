import type { Metadata } from "next";
import SharesContent from "@/content/docs/shares.mdx";
import { pageOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Share Tokens",
  description:
    "Normative specification for Flametrench share tokens — resource-scoped bearer access for shareable links and single-use downloads.",
  openGraph: pageOpenGraph("/docs/shares/"),
};

export default function SharesPage() {
  return (
    <div className="prose-docs">
      <SharesContent />
    </div>
  );
}
