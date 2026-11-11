import { defineConfig } from "eslint/config";
import globals from "globals";

import { TYPESCRIPT_FILES } from "./base.js";
import { createNodeConfig } from "./node.js";

export function createNestConfig(tsconfigRootDirectory) {
  return defineConfig(createNodeConfig(tsconfigRootDirectory), {
    files: TYPESCRIPT_FILES,
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  });
}
