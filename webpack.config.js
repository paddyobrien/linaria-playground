const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const dev = process.env.NODE_ENV !== "production";
const test = process.env.NODE_ENV === "test";

module.exports = {
  mode: dev ? "development" : "production",
  entry: {
    app: "./src/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "[name].bundle.js"
  },
  devServer: {
    allowedHosts: "all",
    devMiddleware: {
      writeToDisk: true,
    },
  },
  target: "web",
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: [
          "es2015",
          "chrome60",
          "firefox60",
          "safari13",
          "edge25",
          "node14",
        ],
        css: true,
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      output: test
        ? "test.assets-manifest.json"
        : `foo.assets-manifest.json`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "@linaria/webpack-loader",
            options: { sourceMap: dev }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: dev, importLoaders: 1, modules: false }
          }
        ],
        sideEffects: true,
      },
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|svg)$/,
        use: [{ loader: "file-loader" }]
      }
    ]
  },
  experiments: {
    backCompat: false,
  },
  
};
