import { describe, it, expect } from "vitest";
import { isActivePath } from "../../js/utils/isActivePath";

describe("isActivePath", () => {
  it("returns true when current path matches the href exactly", () => {
    expect(isActivePath("/home", "/home")).toBe(true);
  });

  it("returns true when path starts with '/' or /index.html", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/index.html", "/index.html")).toBe(true);
  });

  it("returns false when current path does not match the href", () => {
    expect(isActivePath("/home", "/about")).toBe(false);
  });
});
