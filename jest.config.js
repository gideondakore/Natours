module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/", "/dev-data/"],
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/dev-data/**",
    "!**/public/**",
    "!**/coverage/**",
    "!jest.config.js",
  ],
  coverageReporters: ["text", "lcov", "html"],
  verbose: true,
};
