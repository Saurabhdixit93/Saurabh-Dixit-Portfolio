import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { CommandPalette } from "@/components/navigation/CommandPaletteLazy";
import { ScrollHUD } from "@/components/ScrollHUD";
import { SiteHeader } from "@/components/SiteHeader";
import { AssistantProvider } from "@/components/assistant/AssistantContext";
import { AskSaurabh } from "@/components/assistant/AskSaurabhLazy";
import { JsonLd } from "@/components/seo/JsonLd";

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
  alternates: {
    canonical: "https://www.saurabhdixit93.site",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Saurabh Dixit | The Systems Blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurabh Dixit | Full Stack Engineer & VP of Engineering",
    description:
      "Full-Stack Engineer with 3+ years building scalable web apps with React, Next.js, Node.js & AI. VP of Engineering at Sensegrass.",
    images: ["/opengraph-image"],
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
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <JsonLd />
      </head>
      <body
        className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-[var(--accent-contrast)] focus:font-mono focus:text-xs focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>
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
