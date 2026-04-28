import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { PersonaPicker } from "@/components/persona-picker";
import { CodeSample } from "@/components/code-sample";
import { InteractiveAuthz } from "@/components/interactive-authz";
import { Roadmap } from "@/components/roadmap";
import { StatusMatrix } from "@/components/status-matrix";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <PersonaPicker />
        <CodeSample />
        <InteractiveAuthz />
        <Roadmap />
        <StatusMatrix />
      </main>
      <Footer />
    </>
  );
}
