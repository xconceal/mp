const webpack = require('webpack')
const path = require('path')
const root = path.resolve(__dirname, '/')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const loaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true
    }
  },
  {
    loader: 'stylus-loader'
  }
]

// turn off warning
process.noDeprecation = true

module.exports = {
  entry: {
    bundle: './src/app/main.jsx',
    lib: [
      'react',
      'react-dom',
      'react-router'
    ]
  },
  output: {
    filename: 'app.js',
    path: path.join(__dirname, '../output')
  },
  // 调试时定位到编译前的代码位置
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.webpack.js',
      '.jsx', '.js',
      '.vue',
      '.json',
      '.styl'
    ]
  },
  module: {
    // webpack2 use rules
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(styl|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: loaders
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        query: {
            limit: 20000,
            name: 'assets/[name].[ext]?[hash:5]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'lib',
      filename: 'lib.bundle.js'
    })
  ]
}
