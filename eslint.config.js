// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      "react/no-multi-comp": ["error", { ignoreStateless: false }],
    },
  },
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*"],
  },
]);
