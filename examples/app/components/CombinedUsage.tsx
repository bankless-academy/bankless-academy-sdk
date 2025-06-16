"use client";

import { useState } from "react";
import { Lessons, Frame } from "@bankless-academy/sdk";

export default function CombinedUsage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {selectedLesson ? (
        <Frame url={selectedLesson} onClose={() => setSelectedLesson(null)} />
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Lessons
          </h2>
          <Lessons
            lessonSlugs={["bitcoin-basics", "ethereum-basics", "intro-to-defi"]}
          />
        </div>
      )}
    </div>
  );
}
