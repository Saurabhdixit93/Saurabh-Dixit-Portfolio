import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

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
      url: "https://saurabh-dixit-portfolio.vercel.app",
    },
  ],
  creator: "Saurabh Dixit",
  metadataBase: new URL("https://saurabh-dixit-portfolio.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saurabh-dixit-portfolio.vercel.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
