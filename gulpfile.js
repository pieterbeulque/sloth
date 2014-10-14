var gulp   = require('gulp'),
    util   = require('gulp-util'),
    concat = require('gulp-concat'),
    wrap   = require('gulp-wrap'),
    uglify = require('gulp-uglify');

gulp.task('build', function () {
  gulp.src(['sloth.base.js', 'sloth.*-sloth.js'])
      .pipe(concat('sloth.js'))
      .pipe(wrap('(function ($, window, document, undefined) { \'use strict\';  <%= contents %> }(jQuery, window, document))'))
      .pipe(gulp.dest('dist'));

  gulp.src(['sloth.base.js', 'sloth.*-sloth.js'])
      .pipe(concat('sloth.min.js'))
      .pipe(wrap('(function ($, window, document, undefined) { \'use strict\';  <%= contents %> }(jQuery, window, document))'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});

gulp.task('dev', function () {
  gulp.src(['sloth.base.js', 'sloth.*-sloth.js', 'sloth.export.js'])
      .pipe(concat('sloth.js'))
      .pipe(gulp.dest('test'));
});

gulp.task('default', ['dev'], function () {
  gulp.watch('*.js', ['dev']);
});