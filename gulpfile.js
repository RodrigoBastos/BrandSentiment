/**
 * Created by rodrigo on 05/07/15.
 */

var gulp = require('gulp');
var include   = require('gulp-include');
var rename    = require('gulp-rename');
var uglify    = require('gulp-uglify');


gulp.task('js', function (done) {
  gulp.src('./client/source/js/*.js')
    .pipe(include())
    //.pipe(uglify({mangle: false}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./client/public/js'))
    .on('end', done)
  ;

});
