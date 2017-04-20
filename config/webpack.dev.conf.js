const webpack = require('webpack')
const config = require('./webpack.base.conf')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// async add script file
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

module.exports = merge(config, {
  plugins: [
    new CleanWebpackPlugin(['output'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body',
    })
  ],
  devtool: false,
  devServer: {
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
})
