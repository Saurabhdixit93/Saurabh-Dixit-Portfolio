import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import {
  CommandPaletteProvider,
  CommandPalette,
} from "@/components/CommandPalette";
import { ScrollHUD } from "@/components/ScrollHUD";
import { SiteHeader } from "@/components/SiteHeader";
import { AssistantProvider } from "@/components/assistant/AssistantContext";
import { AskSaurabh } from "@/components/assistant/AskSaurabh";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: "Saurabh Dixit | Full Stack Engineer & VP of Engineering",
  description:
    "Full-Stack Engineer with 3+ years of experience building scalable web applications using React, Next.js, Node.js & AI integrations. VP of Engineering at Sensegrass. Expert in API design, automation workflows, and distributed systems.",
  keywords: [
    "Saurabh Dixit",
    "Full Stack Developer",
    "Full Stack Engineer",
    "VP of Engineering",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "AI Engineer",
    "Software Engineer India",
    "Web Developer",
    "TypeScript",
    "JavaScript",
    "API Development",
    "Automation",
    "Sensegrass",
  ],
  authors: [
    {
      name: "Saurabh Dixit",
      url: "https://www.saurabhdixit93.site",
    },
  ],
  creator: "Saurabh Dixit",
  metadataBase: new URL("https://www.saurabhdixit93.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.saurabhdixit93.site",
    title: "Saurabh Dixit | Full Stack Engineer & VP of Engineering",
    description:
      "Full-Stack Engineer with 3+ years of experience building scalable web applications. Expert in React, Next.js, Node.js, AI integrations, and automation workflows.",
    siteName: "Saurabh Dixit Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Saurabh Dixit - Full Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurabh Dixit | Full Stack Engineer & VP of Engineering",
    description:
      "Full-Stack Engineer with 3+ years building scalable web apps with React, Next.js, Node.js & AI. VP of Engineering at Sensegrass.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const themeInitScript = `
(function() {
  var theme = null;
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      theme = 'graphite';
    } else if (stored === 'light') {
      theme = 'paper';
    } else if (stored === 'graphite' || stored === 'paper') {
      theme = stored;
    }
  } catch (e) {}

  if (!theme) {
    try {
      var mql = window.matchMedia('(prefers-color-scheme: light)');
      theme = mql.matches ? 'paper' : 'graphite';
    } catch (e) {
      theme = 'graphite';
    }
  }

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.remove('paper');
  if (theme === 'paper') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="graphite"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://www.saurabhdixit93.site/#person",
                  "name": "Saurabh Dixit",
                  "jobTitle": "VP of Engineering & Full-Stack Systems Engineer",
                  "worksFor": {
                    "@type": "Organization",
                    "name": "Sensegrass",
                  },
                  "url": "https://www.saurabhdixit93.site",
                  "sameAs": [
                    "https://github.com/saurabhdixit93",
                    "https://www.linkedin.com/in/saurabh-dixit-47a82b1b3/",
                  ],
                  "knowsAbout": [
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
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.saurabhdixit93.site/#website",
                  "url": "https://www.saurabhdixit93.site",
                  "name": "Saurabh Dixit Portfolio | The Systems Blueprint",
                  "description":
                    "Portfolio of Saurabh Dixit: VP of Engineering and Full-Stack Systems Engineer.",
                  "publisher": {
                    "@id": "https://www.saurabhdixit93.site/#person",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="graphite"
          value={{
            graphite: "graphite",
            paper: "paper",
          }}
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            <AssistantProvider>
              <ScrollHUD />
              <SiteHeader />
              <CommandPalette />
              <AskSaurabh />
              <div className="pt-14 sm:pt-16 min-h-screen flex flex-col">
                {children}
              </div>
            </AssistantProvider>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
