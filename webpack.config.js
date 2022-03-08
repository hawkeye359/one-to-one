const path = require("path");
const ClearnTerminal = require("clean-terminal-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const webpack = require("webpack");
module.exports = {
  entry: "./src/renderer.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg)$/,
        type: "asset/resource",
      },
    ],
  },
  //   resolve: {
  //     extensions: [".tsx", ".ts", "..."],
  //   },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      filename: "index.html",
    }),
    new ClearnTerminal(),
  ],
  // devServer: {
  //   // liveReload: false,
  //   hot: false,
  //   watchFiles: ["./src/*"],
  // },
  devServer: {
    static: "./dist",
    devMiddleware: {
      // writeToDisk: true,
    },
    client: {
      progress: true,
    },
  },
  watchOptions: {
    ignored: ["./*/node_modules/*"],
  },
};
