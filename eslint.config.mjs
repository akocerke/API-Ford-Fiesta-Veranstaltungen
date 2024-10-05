// eslint.config.mjs
import eslintConfig from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import eslintPluginJest from 'eslint-plugin-jest';

export default [
  // Basis-Einstellungen
  eslintConfig.configs.recommended,

  // Konfiguration für .js-Dateien
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
      jest: eslintPluginJest,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          // Prettier-Einstellungen
          singleQuote: true, // Einfache Anführungszeichen verwenden
          trailingComma: 'es5', // Trailing Commas nur in ES5-kompatiblen Stellen
          bracketSpacing: true, // Leerzeichen innerhalb von geschweiften Klammern
          jsxSingleQuote: true, // Einfache Anführungszeichen in JSX verwenden
          semi: true, // Semikolons verwenden
          printWidth: 80, // Maximale Zeilenlänge
        },
      ],
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Definieren Sie globale Variablen
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        console: 'readonly',
        // Definieren Sie Jest-Globale Variablen
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        test: 'readonly',
      },
    },
    settings: {
      jest: {
        version: 'detect',
      },
    },
  },

  // Jest spezifische Konfigurationen
  {
    files: ['**/*.test.js'],
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      'jest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
];
