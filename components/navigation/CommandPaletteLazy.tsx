"use client";

import dynamic from "next/dynamic";

const DynamicCommandPalette = dynamic(
  () => import("./CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

export function CommandPalette() {
  return <DynamicCommandPalette />;
}

export default CommandPalette;
