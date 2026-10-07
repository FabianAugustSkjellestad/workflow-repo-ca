import { describe, it, expect } from "vitest";

describe("Example test suite", () => {
  it("adds two numbers correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("checks string equality", () => {
    expect("hello").toBe("hello");
  });
});
