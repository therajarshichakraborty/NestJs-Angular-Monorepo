import { defineConfig } from "eslint/config";
import globals from "globals";

import { createBaseConfig } from "./base.js";

export function createNodeConfig(tsconfigRootDirectory) {
  return defineConfig(createBaseConfig(tsconfigRootDirectory), {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  });
}
