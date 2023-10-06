const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const webpack = require('webpack-stream')
const changed = require('gulp-changed')

const srcPath = 'src/'
const distPath = 'dist/'

const paths = {
  css: {
    src: srcPath + 'scss/**/*.scss',
    dist: distPath + 'css',
  },
  js: {
    src: srcPath + 'js/**/*.js',
    dist: distPath + 'js',
  },
  img: {
    src: srcPath + '/images/**/*',
    dist: distPath + 'images',
  },
}

function compileScssDev () {
  return src(paths.css.src).
    pipe(sourcemaps.init()).
    pipe(sass().on('error', sass.logError)).
    pipe(autoprefixer({ cascade: false })).
    pipe(sourcemaps.write('.')).
    pipe(dest(paths.css.dist))
}

function compileScssProd () {
  return src(paths.css.src).
    pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)).
    pipe(autoprefixer({ cascade: false })).
    pipe(dest(paths.css.dist))
}

function minifyCss () {
  return src('dist/css/*.css').pipe(csso()).pipe(dest(paths.css.dist))
}

function cleanMaps () {
  return src(['dist/css/*.map', 'dist/js/*.map'], { read: false }).
    pipe(clean())
}
function concatJs () {
  return src(paths.js.src).
    pipe(changed('./dist/js/')).
    // .pipe(babel())
    pipe(webpack(require('./webpack.config.js'))).
    pipe(dest(paths.js.dist))
}

function minifyJs () {
  return src('dist/js/*.js').pipe(uglify()).pipe(dest(paths.js.dist))
}

function compileImage () {
  return src(paths.img.src).
    pipe(changed('./build/img/')).
    pipe(dest(paths.img.dist))
}

function watchScssDev () {
  watch(paths.css.src, compileScssDev)
}

exports.development = series(compileScssDev, compileImage, concatJs,
  watchScssDev)

exports.production = series(compileScssProd, compileImage, minifyCss, concatJs,
  minifyJs,
  cleanMaps)

exports.default = exports.development