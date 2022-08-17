/* eslint-env node */
const presetEnv = require("@babel/preset-env");
const presetReact = require("@babel/preset-react");

module.exports = function babel(api) {
  const isDevelopmentEnv = api.env("development");
  const isProductionEnv = api.env("production");
  const isTestEnv = api.env("test");
  return {
    presets: [
      isTestEnv && [
        presetEnv.default,
        {
          targets: {
            node: "current",
          },
        },
      ],

      (isProductionEnv || isDevelopmentEnv) && [
        presetEnv.default,
        {
          forceAllTransforms: true,
          useBuiltIns: "entry",
          corejs: 3,
          modules: false,
          exclude: ["transform-typeof-symbol"],
        },
      ],
      ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
      [
        presetReact.default,
        {
          development: isDevelopmentEnv || isTestEnv,
          useBuiltIns: true,
        },
      ],
      "@linaria",
    ].filter(Boolean),
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          helpers: false,
          regenerator: true,
          corejs: false,
        },
      ],
    ].filter(Boolean),
    sourceType: "unambiguous",
  };
};
