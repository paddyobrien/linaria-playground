/* eslint-env node */
const dynamicImport = require("@babel/plugin-syntax-dynamic-import");
const destructuringTransform = require("@babel/plugin-transform-destructuring");
const presetEnv = require("@babel/preset-env");
const presetReact = require("@babel/preset-react");
const dynamicImportNode = require("babel-plugin-dynamic-import-node");
const pluginMacros = require("babel-plugin-macros");

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
      pluginMacros,
      dynamicImport.default,
      isTestEnv && dynamicImportNode,
      // In test we need to get babel to resolve style imports
      // that are used during the linaria pass
      // See https://github.com/callstack/linaria/issues/531
      isTestEnv && [
        "module-resolver",
        {
          root: ["."],
          alias: {
            styles: "./src/styles",
            "@common": "./src/components/common",
          },
        },
      ],
      destructuringTransform.default,
      ["@babel/plugin-proposal-class-properties", {}],
      [
        "@babel/plugin-proposal-object-rest-spread",
        {
          useBuiltIns: true,
        },
      ],
      [
        "@babel/plugin-transform-runtime",
        {
          helpers: false,
          regenerator: true,
          corejs: false,
        },
      ],
      !isTestEnv && [
        "@babel/plugin-transform-regenerator",
        {
          async: false,
        },
      ],
      ["relay"],
    ].filter(Boolean),
    sourceType: "unambiguous",
  };
};
