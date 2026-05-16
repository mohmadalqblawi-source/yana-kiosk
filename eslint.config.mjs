import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node CJS scripts (require) — not part of the Next bundle
    "prisma/**/*.js",
    "scripts/**",
    "check-db.js",
  ]),
  {
    rules: {
      // Common Next/App patterns (Stripe init, data fetch on mount, menu reset) are flagged incorrectly
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
