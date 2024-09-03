module.exports = {
  setupFiles: ['<rootDir>/tests/setup/jest.setup.js'], // Pfad zur Setup-Datei, bitte anpassen
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/'],
};
