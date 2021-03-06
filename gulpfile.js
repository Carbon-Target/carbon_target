const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const clean = require('gulp-clean');
// const imagemin = require('gulp-imagemin');
const slim = require("gulp-slim");
const browsersync = require('browser-sync').create();

const { series, parallel, watch, src, dest } = require('gulp');

function clear() {
  return src('./dist/*', {
    read: false
  }).pipe(clean());
}

function css(cb) {
  const source = 'src/css/*.sass';

  return src(source)
    .pipe(changed(source))
    .pipe(sass())
    .pipe(cssnano())
    .pipe(dest('dist'))
    .pipe(browsersync.stream());
}

function javascript(cb) {
  const source = 'src/js/*.js';

  return src(source)
    .pipe(changed(source))
    .pipe(concat('javascript.js'))
    .pipe(uglify())
    .pipe(dest('dist'))
    .pipe(browsersync.stream());
};

function watchFiles() {
  watch('./src/js/*', javascript);
  watch('./src/*.slim', index);
  watch('./src/images/**/*', images);
  watch('./src/css/*', css);
  watch('./src/img/*', images);
  watch('./src/webfonts/*', icons);
}

function index() {
  return src('./src/index.slim')
    .pipe(slim({
      pretty: true
    }))
    .pipe(dest('./dist/'));
}

function fonts() {
  return src('./src/fonts/*').pipe(dest('./dist/fonts'));
}

function images() {
  return src('./src/images/**/*')
    // .pipe(imagemin())
    .pipe(dest('./dist/images'))
    .pipe(browsersync.stream());
}

function icons() {
  return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(dest('./dist/webfonts'));
}

function browserSync() {
  browsersync.init({
    server: { baseDir: './dist' },
    port: 3000
  });
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(index, fonts, javascript, css, images, icons));
