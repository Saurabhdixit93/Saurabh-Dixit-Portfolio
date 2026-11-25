import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import SignalStrip from "@/components/sections/SignalStrip";

const About = dynamic(() => import("@/components/sections/About"));
const Capabilities = dynamic(
  () => import("@/components/sections/Capabilities"),
);
const StackMap = dynamic(() => import("@/components/sections/StackMap"));
const SelectedWork = dynamic(() => import("@/components/SelectedWork"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const AIWorkflow = dynamic(() => import("@/components/sections/AIWorkflow"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Voices = dynamic(() => import("@/components/sections/Voices"));
const Notes = dynamic(() => import("@/components/sections/Notes"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/sections/Footer"));

const Home = () => {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="relative bg-bg text-text transition-colors duration-200 min-h-screen flex flex-col items-center overflow-x-clip w-full outline-none"
      >
        {/* Milestone 5: Systems Blueprint Hero */}
        <Hero />

        {/* Milestone 5: Live Signal Strip Marquee */}
        <SignalStrip />

        {/* Milestone 6: About & Operating Principles */}
        <About id="about" />

        {/* Milestone 6: Core Capabilities & Architectural Pillars */}
        <Capabilities id="capabilities" />

        {/* Milestone 6: 5-Tier Layered Interactive Stack Map */}
        <StackMap id="stack" />

        {/* Milestone 7: Selected Work & Sticky Case Studies */}
        <SelectedWork id="work" />

        {/* Milestone 8: Career Progression as a Git Branch */}
        <Experience id="experience" />

        {/* Milestone 9: AI Workflow + "Ask Saurabh" Assistant */}
        <AIWorkflow id="ai-workflow" />

        {/* Milestone 10 (Prompt 9): 4-Stage Engineering Process */}
        <Process id="process" />

        {/* Milestone 10 (Prompt 9): Voices & Testimonials (safely auto-hides when empty) */}
        <Voices id="voices" />

        {/* Milestone 10 (Prompt 9): Engineering Notes & ADRs */}
        <Notes id="notes" />

        {/* Milestone 10 (Prompt 10): Contact & Engagement Initiation */}
        <Contact id="contact" />
      </main>

      {/* Milestone 10 (Prompt 10): Blueprint Architectural Footer */}
      <Footer />
    </>
  );
};

export default Home;
