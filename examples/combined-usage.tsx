import React, { useState } from "react";
import { Lessons, Frame } from "../src/react";

export default function CombinedExample() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <div className="container">
      <h1>Bankless Academy Examples</h1>

      {selectedLesson ? (
        <Frame url={selectedLesson} onClose={() => setSelectedLesson(null)} />
      ) : (
        <div className="lessons-section">
          <h2>Available Lessons</h2>
          <Lessons
            lessonSlugs={["bitcoin-basics", "ethereum-basics", "intro-to-defi"]}
          />
        </div>
      )}

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        h1 {
          text-align: center;
          margin-bottom: 1rem;
        }
        .description {
          text-align: center;
          color: #4a5568;
          margin-bottom: 2rem;
        }
        .lessons-section {
          margin-top: 2rem;
        }
        h2 {
          margin-bottom: 1.5rem;
          color: #2d3748;
        }
      `}</style>
    </div>
  );
}
