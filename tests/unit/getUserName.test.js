import { describe, it, expect, beforeEach } from "vitest";
import { getUsername } from "../../js/utils/storage";

describe("getUsername", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("returns the username when user data is present in localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ name: "John Doe" }));
    expect(getUsername()).toBe("John Doe");
  });

  it("returns null when user data is not present in localStorage", () => {
    expect(getUsername()).toBeNull();
  });

  it("returns null when stored user has no name property", () => {
    localStorage.setItem("user", JSON.stringify({ email: "jd@example.com" }));
    expect(getUsername()).toBeNull();
  });
});
