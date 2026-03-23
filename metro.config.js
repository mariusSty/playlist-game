const { withUniwindConfig } = require("uniwind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// withUniwindConfig MUST be the outermost wrapper
module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  polyfills: { rem: 14 },
});
