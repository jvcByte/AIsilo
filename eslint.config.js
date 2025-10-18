import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "!node_modules/",
    "src/routeTree.gen.ts",
    "src/**/routeTree.gen.ts",
    "node_modules/",
    " .vite/",
    "android/",
    "android/**",
    "android/app/build/",
    "android/app/build/**",
  ]),
  ignores([
    "**/node_modules/**",
    "**/dist/**",
    "**/.vite/**",
    "**/android/**",
    "src/routeTree.gen.ts",
    "src/**/routeTree.gen.ts",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
]);
