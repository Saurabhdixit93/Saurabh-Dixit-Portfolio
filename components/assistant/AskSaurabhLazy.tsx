"use client";

import dynamic from "next/dynamic";

const DynamicAskSaurabh = dynamic(
  () => import("./AskSaurabh").then((mod) => mod.AskSaurabh),
  { ssr: false }
);

export function AskSaurabh() {
  return <DynamicAskSaurabh />;
}

export default AskSaurabh;
