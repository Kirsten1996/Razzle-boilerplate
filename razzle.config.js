const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  modify(config, { target, dev }, webpack) {
    const postCssOptions = {
      ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
      sourceMap: dev,
      plugins: [
        require("autoprefixer")({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9" // React doesn't support IE8 anyway
          ]
        })
      ]
    };

    const isWeb = target === "web";

    const newConf = {
      ...config,
      optimization: {
        sideEffects: false,
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false // set to true if you want JS source maps
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      },
      plugins: [
        ...config.plugins,
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        })
      ],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.scss$/,
            use: isWeb
              ? [
                  dev ? "style-loader" : MiniCssExtractPlugin.loader,
                  { loader: "css-loader" },
                  { loader: "postcss-loader", options: postCssOptions },
                  "sass-loader"
                ]
              : "css-loader"
          }
        ]
      }
    };

    return newConf;
  }
};
