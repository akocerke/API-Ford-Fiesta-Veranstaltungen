// eslint.config.mjs
import eslintConfig from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import eslintPluginJest from "eslint-plugin-jest";

export default [
  // Basis-Einstellungen
  eslintConfig.configs.recommended,

  // Konfiguration für .js-Dateien
  {
    files: ["**/*.js"],
    plugins: {
      prettier,
      jest: eslintPluginJest,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          // Füge hier deine Prettier-Einstellungen hinzu
          singleQuote: true,
          trailingComma: "es5",
        },
      ],
      "no-unused-vars": "warn",
      "no-undef": "error",
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
        test: "readonly",
      },
    },
    settings: {
      jest: {
        version: "detect",
      },
    },
  },

  // Jest spezifische Konfigurationen
  {
    files: ["**/*.test.js"],
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      "jest/consistent-test-it": ["error", { fn: "test" }],
    },
  },
];
