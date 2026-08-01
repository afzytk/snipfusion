import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test("renders the Shadcn button on the screen", () => {
  render(<App />);

  const buttonElement = screen.getByText("Edit");
  expect(buttonElement).toBeInTheDocument();
});
