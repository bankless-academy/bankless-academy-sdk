import React, { useState } from "react";
import { Frame } from "../src/react";

export default function FrameExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container">
      <h1>Bankless Academy Frame</h1>
      <button className="open-button" onClick={() => setIsOpen(true)}>
        Open Bitcoin Lesson
      </button>

      {isOpen && (
        <Frame
          url="https://app.banklessacademy.com/lessons/bitcoin-basics"
          onClose={() => setIsOpen(false)}
        />
      )}

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        h1 {
          margin-bottom: 2rem;
        }
        .open-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .open-button:hover {
          background-color: #2c5282;
        }
      `}</style>
    </div>
  );
}
