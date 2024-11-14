const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // Ensures routing works correctly
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Ensure this path is correct
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"), // New syntax for serving static files
    },
    compress: true,
    port: 9000,
  },
  mode: "development",
};
