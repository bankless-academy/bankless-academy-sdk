import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasicExample from "../basic-usage";
import FrameExample from "../frame-usage";
import CombinedExample from "../combined-usage";

describe("Bankless Academy SDK Components", () => {
  describe("Lessons Component", () => {
    it("renders the basic example correctly", () => {
      render(<BasicExample />);
      expect(screen.getByText("Bankless Academy Lessons")).toBeInTheDocument();
    });

    it("renders lesson cards when data is loaded", async () => {
      render(<BasicExample />);
      // Wait for loading to complete
      const lessonCards = await screen.findAllByRole("article");
      expect(lessonCards.length).toBeGreaterThan(0);
    });
  });

  describe("Frame Component", () => {
    it("opens when the button is clicked", () => {
      render(<FrameExample />);
      const button = screen.getByText("Open Bitcoin Lesson");
      fireEvent.click(button);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("closes when the close button is clicked", () => {
      render(<FrameExample />);
      const button = screen.getByText("Open Bitcoin Lesson");
      fireEvent.click(button);
      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Combined Usage", () => {
    it("switches between lessons list and frame view", async () => {
      render(<CombinedExample />);

      // Initial state should show lessons
      expect(screen.getByText("Available Lessons")).toBeInTheDocument();

      // Click a lesson to open the frame
      const lessonCards = await screen.findAllByRole("article");
      fireEvent.click(lessonCards[0]);

      // Should now show the frame
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Close the frame
      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      // Should be back to lessons list
      expect(screen.getByText("Available Lessons")).toBeInTheDocument();
    });
  });
});
