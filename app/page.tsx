"use client";

import Hero from "@/components/sections/Hero";
import SignalStrip from "@/components/sections/SignalStrip";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import StackMap from "@/components/sections/StackMap";
import SelectedWork from "@/components/SelectedWork";
import Experience from "@/components/sections/Experience";
import AIWorkflow from "@/components/sections/AIWorkflow";
import Process from "@/components/sections/Process";
import Voices from "@/components/sections/Voices";
import Notes from "@/components/sections/Notes";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const Home = () => {
  return (
    <main className="relative bg-bg text-text transition-colors duration-200 min-h-screen flex flex-col items-center overflow-x-hidden w-full">
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

      {/* Milestone 10 (Prompt 10): Blueprint Architectural Footer */}
      <Footer />
    </main>
  );
};

export default Home;
