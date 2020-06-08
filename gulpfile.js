"use strict";

const { src, series, parallel, dest, watch } = require("gulp");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
// const minifyCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const paths = {
  src: {
    html: "src/*.html",
    styles: "src/assets/scss/**/*.scss",
    images: "src/assets/images/*",
    js: "src/**/*.js",
  },
  dest: {
    html: "dist/html/",
    styles: "dist/assets/css/",
    images: "dist/assets/images/",
    js: "dist/js/",
  },
};

function styleTask() {
  return src(paths.src.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.dest.styles));
}

function imgTask() {
  return src(paths.src.images).pipe(imagemin()).pipe(dest(paths.dest.images));
}

function htmlTask() {
  return src(paths.src.html).pipe(dest(paths.dest.html));
}

function jsTask() {
  return src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat("all.js"))
    .pipe(terser()) //uglify doesn't minify ES6
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.dest.js));
}

function watchTask() {
  watch(
    [paths.src.js, paths.src.styles],
    { interval: 1000 },
    parallel(styleTask, jsTask)
  );
}

exports.imgTask = imgTask;
exports.styleTask = styleTask;

exports.default = series(
  parallel(htmlTask, imgTask, jsTask, styleTask),
  watchTask
);
