"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { capabilities } from "@/content/capabilities";
import { CapabilityCard } from "./capabilities/CapabilityCard";

export interface CapabilitiesProps {
  id?: string;
  className?: string;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({
  id = "capabilities",
  className = "",
}) => {
  // Mobile accordion state tracking which pillars are expanded
  const [expandedPillars, setExpandedPillars] = React.useState<Record<string, boolean>>({
    "ai-platforms": true, // Default first pillar open on mobile for immediate visual discovery
  });

  const togglePillar = (pillarId: string) => {
    setExpandedPillars((prev) => ({
      ...prev,
      [pillarId]: !prev[pillarId],
    }));
  };

  return (
    <Section
      id={id}
      annotation="// 02 · CAPABILITIES & DOMAIN EXPERTISE"
      heading={
        <>
          Engineered for scale, built for{" "}
          <span className="italic text-accent">production</span>.
        </>
      }
      subheading="Four foundational disciplines combining deep architecture, hands-on development, and team scaling."
      withHairline
      withCornerMarks
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {capabilities.map((capability, index) => (
          <CapabilityCard
            key={capability.id}
            capability={capability}
            index={index}
            isOpen={Boolean(expandedPillars[capability.id])}
            onToggle={() => togglePillar(capability.id)}
          />
        ))}
      </div>
    </Section>
  );
};

export default Capabilities;
