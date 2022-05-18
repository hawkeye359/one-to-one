const path = require("path");
const ClearnTerminal = require("clean-terminal-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const webpack = require("webpack");
module.exports = {
  entry: "./src/renderer.tsx",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
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
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", "..."],
  },
  externals: {
    sqlite3: "commonjs sqlite3",
    knex: "commonjs knex",
    path: "commonjs path",
    fs: "commonjs fs",
    remote: "commonjs remote",
    "@electron/remote": "commonjs @electron/remote",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      filename: "index.html",
    }),
    // new ClearnTerminal(),
  ],
  // devServer: {
  //   // liveReload: false,
  //   hot: false,
  //   watchFiles: ["./src/*"],
  // },
  devServer: {
    static: "./build",
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
