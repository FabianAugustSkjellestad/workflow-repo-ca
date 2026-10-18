import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Test files: add Vitest globals
  {
    files: ["**/*.test.{js,mjs,cjs}", "**/tests/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
  // Turn off rules that conflict with Prettier
  prettier,
]);
