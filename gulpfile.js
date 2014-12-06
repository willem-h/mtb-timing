/*!
 * gulp
 * $ npm install gulp-jshint --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint');

// Scripts
gulp.task('lint', function() {
  return gulp.src('**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
