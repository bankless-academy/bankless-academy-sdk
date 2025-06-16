"use client";

import { useState } from "react";
import { Frame } from "@bankless-academy/sdk";

export default function FrameUsage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <button
        className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setIsOpen(true)}
      >
        Open Bitcoin Lesson
      </button>

      {isOpen && (
        <Frame
          url="https://app.banklessacademy.com/lessons/bitcoin-basics"
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
