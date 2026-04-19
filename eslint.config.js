import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules", "dist", ".next"],
  },

  js.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.recommendedTypeChecked[0],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tseslint.configs.strictTypeChecked[0],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
