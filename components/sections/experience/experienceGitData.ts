import { experiences } from "@/content/experience";
import { ExperienceItem } from "@/content/types";

export interface GitRoleMetadata {
  commitHash: string;
  branch: string;
  branchType: "trunk" | "branch";
  gitAction: string;
  commitMessage: string;
  isLive: boolean;
}

export interface GitExperienceItem extends ExperienceItem {
  git: GitRoleMetadata;
}

export const GIT_EXPERIENCE_DATA: GitExperienceItem[] = experiences.map((exp) => {
  switch (exp.id) {
    case "sensegrass-vpe":
      return {
        ...exp,
        git: {
          commitHash: "a1d49e6",
          branch: "feat/sensegrass",
          branchType: "branch" as const,
          gitAction: "HEAD -> feat/sensegrass",
          commitMessage: "lead(eng): directing org, delivery +35%, scalable ai pipelines",
          isLive: true,
        },
      };
    case "sensegrass-sr-sde":
      return {
        ...exp,
        git: {
          commitHash: "5b9a784",
          branch: "feat/sensegrass",
          branchType: "branch" as const,
          gitAction: "commit",
          commitMessage: "perf(distributed): optimize throughput +30% & fault reduction -45%",
          isLive: false,
        },
      };
    case "sensegrass-fullstack":
      return {
        ...exp,
        git: {
          commitHash: "8c3f412",
          branch: "feat/sensegrass",
          branchType: "branch" as const,
          gitAction: "checkout -b feat/sensegrass",
          commitMessage: "feat(platform): full-stack engineering & ai chatbot integration",
          isLive: false,
        },
      };
    case "kenmark-itan":
    default:
      return {
        ...exp,
        git: {
          commitHash: "e2b8109",
          branch: "main",
          branchType: "trunk" as const,
          gitAction: "init",
          commitMessage: "feat(kenmark): initial commit · node.js backend & restful apis",
          isLive: false,
        },
      };
  }
});
