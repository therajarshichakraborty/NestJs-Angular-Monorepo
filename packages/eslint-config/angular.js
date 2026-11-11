import angular from "angular-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

import { IGNORED_PATHS, createTypeScriptConfig, javaScriptConfig } from "./base.js";

export function createAngularConfig(tsconfigRootDirectory, options = {}) {
  const selectorPrefix = options.selectorPrefix ?? "app";
  const typeScriptConfig = createTypeScriptConfig(tsconfigRootDirectory);

  return defineConfig(
    globalIgnores(IGNORED_PATHS),
    javaScriptConfig,
    {
      ...typeScriptConfig,
      extends: [...typeScriptConfig.extends, angular.configs.tsRecommended],
      processor: angular.processInlineTemplates,
      languageOptions: {
        ...typeScriptConfig.languageOptions,
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        ...typeScriptConfig.rules,
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@angular-eslint/component-selector": [
          "error",
          { type: "element", prefix: selectorPrefix, style: "kebab-case" },
        ],
        "@angular-eslint/directive-selector": [
          "error",
          { type: "attribute", prefix: selectorPrefix, style: "camelCase" },
        ],
      },
    },
    {
      files: ["**/*.html"],
      extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    },
    eslintConfigPrettier,
  );
}
