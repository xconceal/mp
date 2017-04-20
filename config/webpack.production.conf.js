const webpack = require('webpack')
const config = require('./webpack.base.conf')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const staticUrl = require('./static-url')


function AsyncScript () {}
AsyncScript.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-html-processing', function (htmlPluginData, callback) {
      var regexp = new RegExp('(<script)((?=([^>]+\\bsrc=))\\3[\'"]?(?:' + JSON.parse(htmlPluginData.plugin.assetJson).filter(function(i){return /\.js$/.test(i)}).join('|') + ')[\'"]?\\b)', 'g')
      htmlPluginData.html = htmlPluginData.html.replace(regexp, function (str, s1, s2) {
        return s1 + ' async' + s2
      })
      callback(null, htmlPluginData)
    })
  })
}

// whether to generate source map for production files.
// disabling this can speed up the build.
// console.log(process.argv)

const SOURCE_MAP = false
const publicPath = staticUrl(process.env.NODE_ENV)

module.exports = merge(config, {
  output: {
    // naming output files with hashes for better caching.
    // dist/index.html will be auto-generated with correct URLs.
    filename: 'app.[chunkhash:8].js',
    publicPath: publicPath,
    chunkFilename: '[id].[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
        drop_console: true
      },
      sourceMap: false,
      mangle: false
    }),
    // extract css into its own file
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    // clean content before the last release, avoid cache
    new CleanWebpackPlugin(['build'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    // optimize html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body',
      chunks: ['bundle'],
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new AsyncScript()
  ],
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
})
