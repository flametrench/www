import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { CodeSample } from "@/components/code-sample";
import { InteractiveAuthz } from "@/components/interactive-authz";
import { Roadmap } from "@/components/roadmap";
import { SdkGrid } from "@/components/sdk-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <CodeSample />
        <InteractiveAuthz />
        <Roadmap />
        <SdkGrid />
      </main>
      <Footer />
    </>
  );
}
