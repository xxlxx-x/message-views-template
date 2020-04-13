module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleDirectories: ["node_modules", "src", "example"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/example/$1"
  }
};
