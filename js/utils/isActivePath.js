/**
 * Determines whether a given link path matches the current path.
 * Normalizes trailing slashes and "index.html" so "/", "/index.html",
 * and paths with a trailing slash are treated as equivalent.
 *
 * @param {string} linkPath - The path from the link (e.g. href).
 * @param {string} currentPath - The current window.location.pathname.
 * @returns {boolean} True if the link represents the active path.
 */
export function isActivePath(linkPath, currentPath) {
  if (typeof linkPath !== "string" || typeof currentPath !== "string") {
    return false;
  }

  const normalize = (p) => {
    let out = p.trim();
    if (!out.startsWith("/")) out = "/" + out;
    out = out.replace(/\/index\.html$/i, "/");
    if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
    return out || "/";
  };

  return normalize(linkPath) === normalize(currentPath);
}
