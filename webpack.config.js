const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

 
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["babel-polyfill", "./index.js"],
  resolve: {
    alias: {
      "@actions": path.resolve(__dirname, "src/redux/actions"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@atoms": path.resolve(__dirname, "src/components/atoms"),
      "@molecules": path.resolve(__dirname, "src/components/molecules"),
      "@organisms": path.resolve(__dirname, "src/components/organisms")
    }
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /mapbox-gl.+\.js$/,
        loader: "transform/cacheable?brfs"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        oneOf: [
          {
            resourceQuery: /raw/,
            use: "raw-loader"
          },
          {
            use: "babel-loader"
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: "raw-loader"
      },
  
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      // {
      //   test: /node_modules\/(pdfkit)\//,
      //   loader: 'transform-loader?brfs'
      // },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ["url-loader", "img-loader"]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
    library: "Webcam",
    chunkFilename: "[name].js",
    libraryTarget: "umd"
  },
  devServer: {
    historyApiFallback: true,
    host: "localhost",
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "../dist/index.html"
    }),
  ],
  devtool: "cheap-module-eval-source-map"
};
