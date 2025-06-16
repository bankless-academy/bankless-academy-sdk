"use client";

import { Lessons } from "@bankless-academy/sdk";

export default function BasicUsage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Lessons lessonSlugs={["bitcoin-basics", "ethereum-basics"]} />
    </div>
  );
}
