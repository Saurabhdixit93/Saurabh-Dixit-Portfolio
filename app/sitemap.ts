import { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.saurabhdixit93.site";
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dev/tokens`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  // Dynamic flagship case study routes
  const projectRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${baseUrl}/work/${study.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}

