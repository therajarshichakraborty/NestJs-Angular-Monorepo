import { createAngularConfig } from "@repo/eslint-config/angular";

/**
 * The components in this package are generated from ZardUI and kept close to upstream so they can be
 * re-synced. A few strict rules are relaxed here because satisfying them would mean diverging from
 * upstream or renaming public selectors that consuming templates already rely on.
 */
export default [
  ...createAngularConfig(import.meta.dirname, { selectorPrefix: "z" }),
  {
    files: ["**/*.ts"],
    rules: {
      // ZardUI attaches components to native elements (e.g. `table[z-table]`) and uses kebab-case attributes.
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/no-input-rename": "off",
      // Upstream code works with untyped DOM refs and template contexts.
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      // Library code reports developer misuse (e.g. missing providers) through the console.
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
];
