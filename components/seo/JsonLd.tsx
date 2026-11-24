import React from "react";
import { profile } from "@/content/profile";

export interface PersonSchema {
  "@type": "Person";
  "@id": string;
  name: string;
  jobTitle: string;
  worksFor: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  url: string;
  sameAs: string[];
  email: string;
  description: string;
  knowsAbout: string[];
  address?: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
}

export interface WebSiteSchema {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  description: string;
  publisher: {
    "@id": string;
  };
  inLanguage?: string;
}

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": [PersonSchema, WebSiteSchema];
}

export function generateJsonLd(): JsonLdGraph {
  const canonicalUrl = profile.siteUrl || "https://www.saurabhdixit93.site";
  const sameAs = profile.socials
    .filter((s) => s.platform === "github" || s.platform === "linkedin")
    .map((s) => s.url);

  const personId = `${canonicalUrl}/#person`;
  const websiteId = `${canonicalUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: "VP of Engineering & Full-Stack Systems Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Sensegrass",
          url: "https://sensegrass.com",
        },
        url: canonicalUrl,
        sameAs: sameAs,
        email: profile.email,
        description: profile.shortBio,
        knowsAbout: [
          "Full-Stack Systems Architecture",
          "AI Engineering & LLM Orchestration",
          "Distributed Systems & APIs",
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "FastAPI",
          "PostgreSQL",
          "Redis",
          "Engineering Leadership",
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "India",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonicalUrl,
        name: "Saurabh Dixit | The Systems Blueprint",
        description: profile.headline,
        publisher: {
          "@id": personId,
        },
        inLanguage: "en-US",
      },
    ],
  };
}

export function JsonLd() {
  const data = generateJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export default JsonLd;
