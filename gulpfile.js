'use strict'

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const webpack = require('gulp')
const runSequence = require('gulp-run-sequence')
const frep = require('gulp-frep')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const staticUrl = require('./config/static-url')

let concatConf = []

// 压缩html，css，js的配置
let minConf = {
  html: {
    'remove-intertag-spaces': true,
    'compress-js': false,
    'compress-css': false
  },
  css: {
    keepSpecialComments: 0,
    compatibility: 'ie8',
    advanced: false,
    aggressiveMerging: false
  },
  js: {}
}

/**
 * 替换路径的配置
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
let replaceConf = function (env) {
  let conf = {}
  let projectName = process.argv[4]
  let baseUrl = staticUrl(env, projectName)
  conf = [{
    pattern: /\=\/static\//g,
    replacement: '=' + baseUrl
  }, {
    pattern: /\=\'\/static\//g,
    replacement: "='" + baseUrl
  }, {
    pattern: /\=\"\/static\//g,
    replacement: '="' + baseUrl
  }, {
    pattern: /url\(\/static\//g,
    replacement: 'url(' + baseUrl
  }, {
    pattern: /url\(\'\/static\//g,
    replacement: "url('" + baseUrl
  }, {
    pattern: /url\(\"\/static\//g,
    replacement: 'url("' + baseUrl
  }, {
    pattern: /\'\/static\//g,
    replacement: "'" + baseUrl
  }, {
    pattern: /\"\/static\//g,
    replacement: '"' + baseUrl
  }]
  return conf
}

// 替换静态文件引用地址
let replaceLinks = function (env) {
  let opts = replaceConf(env)
  if (!opts) return

  return gulp.src(['output/**/*.js', 'output/**/*.css', 'output/**/*.html'])
    .pipe(frep(opts))
    .pipe(gulp.dest('output/'))
}

function revFile (type) {
  gulp.src(['./rev/*.json', 'output/**/*.' + type ])
    .pipe(revCollector())
    .pipe(gulp.dest('./output/'))
}

// 添加MD5
gulp.task('addMd5', () => {
  return gulp.src('src/assets/imgs/**/*.*').pipe(rev())
    .pipe(gulp.dest('output/assets/imgs'))
    .pipe(rev.manifest()) // 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev'))
})

gulp.task('revHtml', function () {
  revFile('html')
})

gulp.task('revCss', function () {
  revFile('css')
})

gulp.task('revTsx', function () {
  revFile('tsx')
})

gulp.task('revJs', function () {
  revFile('jsx')
})

gulp.task('rev', function (cb) {
  runSequence('addMd5', ['revHtml', 'revCss', 'revTsx', 'revJs'], cb)
})

// 处理压缩css（含stylus）
gulp.task('mincss', function () {
  return gulp.src(['./src/**/*.css', './src/**/*.styl'])
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('output/'))
})

// 处理压缩html
gulp.task('minhtml', function () {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('output/'))
})

// 处理压缩TS／JS文件，转换成ES5
gulp.task('minjs', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify(minConf.js))
    .pipe(gulp.dest('output/'))
})

gulp.task('min', ['minhtml', 'mincss', 'minjs'], function () {})

// 生产环境路径替换
gulp.task('rep-prd', function () {
  replaceLinks('production')
})

// 上线打包
gulp.task('production', function (cb) {
  runSequence('min', 'rep-prd', 'rev', cb)
})
