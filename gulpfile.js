'use strict';

var gulp = require('gulp');
// var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

var imageop = require('gulp-image-optimization');

var runSequence = require('run-sequence');

gulp.task('html', function() {
  gulp.src('./src/index.html').pipe(gulp.dest('./dist'));
});

// gulp.task('sass', function () {
//   return gulp.src('./src/styles/**/*.{scss, sass}')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./dist/styles'));
// });



gulp.task('images', function(cb) {
    gulp.src(['src/**/*.png','src/**/*.jpg','src/**/*.gif','src/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

gulp.task('watch', function () {
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/styles/**/*.{scss, sass}', ['sass']);
});


// Static Server + watching scss/html files
gulp.task('serve', ['watch'], function() {

  browserSync.init({
      server: "./dist"
  });

  gulp.watch("dist/styles/**/*.css", ['watch']);
  gulp.watch("dist/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./src/styles/**/*.{scss, sass}")
      .pipe(sass())
      .pipe(gulp.dest("dist/styles"))
      .pipe(browserSync.stream());
});

gulp.task('default',['serve']);


gulp.task('build', function(callback) {
  runSequence(['html', 'sass'], 'watch',
              'serve',
              callback);
});