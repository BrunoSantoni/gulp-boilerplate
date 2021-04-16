const gulp = require('gulp');

const fileinclude = require('gulp-file-include');
const del = require('del');

const imagemin = require('gulp-imagemin');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const browsersync = require('browser-sync').create();

const paths = {
  scripts: {
    src: './src/js/**/*.js',
    dest: './build/js',
  },

  styles: {
    src: './src/styles/**/*.scss',
    dest: './build/styles',
  },

  assets: {
    src: './src/assets/**/*',
    dest: './build/assets',
  },

  html: {
    pages: './src/pages/**/*.html',
    components: './src/components/**/*.html',
    dest: './build',
  },
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './build',
    },
    port: 3000,
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del(['./build/assets/']);
}

function includeHTML() {
  return gulp.src(paths.html.pages)
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file',
    }))
    .pipe(gulp.dest(paths.html.dest));
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(autoprefixer())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream());
}

function images() {
  return gulp.src(paths.assets.src)
    .pipe(imagemin([
      // png
      imagemin.optipng({
        optimizationLevel: 2,
      }),
      // gif
      imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 3,
      }),
      // svg
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      }),
      // jpg lossless
      imagemin.mozjpeg({
        progressive: true,
      }),
    ]))
    .pipe(gulp.dest(paths.assets.dest));
}

function localImages() {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.assets.src, localImages);
  gulp.watch([paths.html.pages, paths.html.components]).on('change', gulp.series(includeHTML, browserSyncReload));
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(clean, gulp.parallel(styles, scripts, includeHTML, images));

exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;
exports.includeHTML = includeHTML;

exports.build = build;
exports.watch = watch;
