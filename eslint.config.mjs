import eslintConfig from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  eslintConfig.configs.recommended, // Verwendung der empfohlenen Konfiguration
  configPrettier, // Integration von Prettier zur Konfliktvermeidung
  {
    files: ["**/*.js"], // Gilt für alle JavaScript-Dateien
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error", // Prettier-Fehler als ESLint-Fehler behandeln
    },
    languageOptions: {
      ecmaVersion: "latest", // Verwende die neueste ECMAScript-Version
      sourceType: "module", // Setze den Quelltyp auf Modul
      globals: {
        // Definiere globale Variablen
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
      },
    },
  },
];
