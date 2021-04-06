import { args } from "./utils";

const WebpackConfig = {
  mode: !args.production ? "development" : "production",
  devtool: !args.production ? "inline-source-map" : "source-map",
  target: ['web'],
  output: {
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all"
    },
    minimize: args.production,
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({
          parallel: true,
          extractComments: true
        }).apply(compiler);
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env","@babel/preset-react"]
          }
        }
      }
    ]
  }
};

module.exports = WebpackConfig;
