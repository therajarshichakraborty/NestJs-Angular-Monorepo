import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

import { IGNORED_PATHS, javaScriptConfig } from "./base.js";

export default defineConfig(globalIgnores(IGNORED_PATHS), javaScriptConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
});
