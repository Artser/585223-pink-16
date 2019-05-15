"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var cssmin = require("gulp-cssmin");
var clean = require("gulp-clean");
var img = require("gulp-image");

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("css:build", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(cssmin())
    .pipe(gulp.dest("build/css"));
});

gulp.task("clean", function () {
  return gulp.src("build", {
      read: false,
      allowEmpty: true
    })
    .pipe(clean());
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("source/img/*")
    .pipe(img({
      pngquant: true,
      optipng: false,
      zopflipng: false,
      jpegRecompress: true,
      mozjpeg: false,
      guetzli: false,
      gifsicle: true,
      svgo: true,
      concurrent: 6,
      quiet: true
    }))
    .pipe(gulp.dest("build/img"));
})

gulp.task("start", gulp.series("css", "server"));
gulp.task("build", gulp.series("clean", "html", "css:build", "images"));
