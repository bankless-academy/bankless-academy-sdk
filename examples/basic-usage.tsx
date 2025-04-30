import React from "react";
import { Lessons } from "../src/react";

export default function BasicExample() {
  return (
    <div className="container">
      <h1>Bankless Academy Lessons</h1>
      <Lessons lessonSlugs={["bitcoin-basics", "ethereum-basics"]} />
      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        h1 {
          margin-bottom: 2rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
