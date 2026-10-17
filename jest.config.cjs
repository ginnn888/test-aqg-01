/** Prepared by Quality Gate. Review before merging. */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**/*.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/**/*.spec.js'],
  coverageReporters: ['text', 'json-summary', 'lcov'],
};
