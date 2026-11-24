export { Hero, type HeroProps } from "./Hero";
export { SignalStrip, type SignalStripProps, type SignalItem, SIGNAL_ITEMS } from "./SignalStrip";
export { SystemCoreDiagram, type SystemCoreDiagramProps } from "./hero/SystemCoreDiagram";
export { HeroMetrics, type HeroMetricsProps } from "./hero/HeroMetrics";
export { CountUpNumber, type CountUpNumberProps } from "./hero/CountUpNumber";

// Milestone 6 (Step F): About, Capabilities, StackMap
export { About, type AboutProps } from "./About";
export { BioBlock, type BioBlockProps } from "./about/BioBlock";
export { LeadershipCallout, type LeadershipCalloutProps } from "./about/LeadershipCallout";
export { PrincipleCard, type PrincipleCardProps } from "./about/PrincipleCard";

export { Capabilities, type CapabilitiesProps } from "./Capabilities";
export { CapabilityCard, type CapabilityCardProps } from "./capabilities/CapabilityCard";

export { StackMap, type StackMapProps } from "./StackMap";
export { StackTierRow, type StackTierRowProps } from "./stack/StackTierRow";
export { StackChip, type StackChipProps, type StackChipState } from "./stack/StackChip";
export { StackTelemetry, type StackTelemetryProps } from "./stack/StackTelemetry";
export { StackConnectorSvg, type StackConnectorSvgProps } from "./stack/StackConnectorSvg";
export { STACK_RELATIONS, getRelatedTechnologies } from "./stack/stackRelations";

// Milestone 7 (Step G): Selected Work & Case Studies
export { SelectedWork, type SelectedWorkProps } from "./SelectedWork";
export { FeaturedProjectCard, type FeaturedProjectCardProps } from "./work/FeaturedProjectCard";
export { MoreBuildsGrid, type MoreBuildsGridProps } from "./work/MoreBuildsGrid";

// Milestone 8 (Step H): Experience as Git-Graph Timeline
export { Experience, type ExperienceProps } from "./Experience";
export { GitGraphTimeline, type GitGraphTimelineProps } from "./experience/GitGraphTimeline";
export { GitCommitCard, type GitCommitCardProps } from "./experience/GitCommitCard";
export { GitTrackSvg, type GitTrackSvgProps } from "./experience/GitTrackSvg";
export { EducationFootnote, type EducationFootnoteProps } from "./experience/EducationFootnote";
export { formatExperiencePeriod, getExperiencePeriodTodo } from "./experience/dateUtils";
export { HighlightMetrics, highlightMetricsText, type HighlightMetricsProps } from "./experience/highlightMetrics";
export { GIT_EXPERIENCE_DATA, type GitExperienceItem, type GitRoleMetadata } from "./experience/experienceGitData";

// Milestone 9 (Step I): AI Workflow + "Ask Saurabh" Assistant
export { AIWorkflow, type AIWorkflowProps } from "./AIWorkflow";
export { AIPipelineDiagram } from "./ai-workflow/AIPipelineDiagram";
export { AIToolsGrid } from "./ai-workflow/AIToolsGrid";
export { AssistantTeaser } from "./ai-workflow/AssistantTeaser";

// Milestone 10 (Prompt 9 & 10): Process, Voices, Notes, Contact, Footer
export { Process, type ProcessProps } from "./Process";
export { ProcessCard, type ProcessCardProps } from "./process/ProcessCard";
export { Voices, type VoicesProps } from "./Voices";
export { Notes, type NotesProps } from "./Notes";
export { Contact, type ContactProps } from "./Contact";
export { Footer } from "./Footer";


