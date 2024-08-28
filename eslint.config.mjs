// eslint.config.mjs
import eslintConfig from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import eslintPluginJest from "eslint-plugin-jest";

export default [
  eslintConfig.configs.recommended,
  configPrettier,
  {
    files: ["**/*.js"],
    plugins: {
      prettier,
      jest: eslintPluginJest,
    },
    rules: {
      "prettier/prettier": "error",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Definieren Sie globale Variablen
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
        // Definieren Sie Jest-Globale Variablen
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    extends: [
      "plugin:prettier/recommended",
      "plugin:jest/recommended", // Fügt Jest-spezifische Regeln hinzu
    ],
  },
];
