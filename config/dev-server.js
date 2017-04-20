var PORT = {
  dev: 8100
}

var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var path = require('path')
var app = express()

var httpPort = PORT.dev
var compiler = webpack(config)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
// app.use('/static', express.static('../static'))
// console.log(path.join(__dirname, '../src/assets'))
// 通过http://localhost:8080/static/aa.js
// 其中aa.js就是assets下边的文件
// app.use('/static', express.static(path.join(__dirname, '../src/static')))
// app.use('/mock', express.static(path.join(__dirname, '../mock/')))

module.exports = app.listen(httpPort, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + httpPort)
})
