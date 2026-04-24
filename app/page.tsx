import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { CodeSample } from "@/components/code-sample";
import { InteractiveEncoder } from "@/components/interactive-encoder";
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
        <InteractiveEncoder />
        <Roadmap />
        <SdkGrid />
      </main>
      <Footer />
    </>
  );
}
