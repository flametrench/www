import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Container } from "@/components/container";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <Container className="mt-10 grid grid-cols-1 gap-10 pb-16 md:grid-cols-[200px_1fr] md:gap-14">
        <aside className="md:pt-6">
          {/* DocsSidebar is a server component; we pass the current pathname
              at render time via a wrapper if we need it highlighted. */}
          <DocsSidebar currentPath="" />
        </aside>
        <article className="prose prose-invert prose-docs max-w-none">
          {children}
        </article>
      </Container>
      <Footer />
    </>
  );
}
