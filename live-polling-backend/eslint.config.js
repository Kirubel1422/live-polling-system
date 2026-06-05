import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ["dist/", "node_modules/", "logs/", "coverage/"],
  },
  {
    rules: {
      // Relaxed for existing codebase
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "warn",
      "prefer-const": "warn",
      "no-unreachable": "error",
      "no-duplicate-imports": "warn",
    },
  }
);
