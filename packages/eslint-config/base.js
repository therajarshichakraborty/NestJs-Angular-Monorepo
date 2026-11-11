import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export const TYPESCRIPT_FILES = ["**/*.ts", "**/*.mts", "**/*.cts"];

export const JAVASCRIPT_FILES = ["**/*.js", "**/*.mjs", "**/*.cjs"];

export const IGNORED_PATHS = [
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/node_modules/**",
  "**/.turbo/**",
  "**/.angular/**",
  "**/logs/**",
];

export const javaScriptConfig = {
  files: JAVASCRIPT_FILES,
  extends: [eslint.configs.recommended],
};

export function createTypeScriptConfig(tsconfigRootDirectory) {
  return {
    files: TYPESCRIPT_FILES,
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: tsconfigRootDirectory,
      },
    },
    rules: {
      eqeqeq: ["error", "always"],
      "no-console": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
  };
}

export function createBaseConfig(tsconfigRootDirectory) {
  return defineConfig(
    globalIgnores(IGNORED_PATHS),
    javaScriptConfig,
    createTypeScriptConfig(tsconfigRootDirectory),
    eslintConfigPrettier,
  );
}
