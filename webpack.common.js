const path = require("path");

module.exports = {
  entry: {
    lightbox: ["./src/lightbox.ts", "./src/lightbox.scss"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
