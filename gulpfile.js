var gulp = require('gulp');
var include = require('gulp-include');
var rename = require('gulp-rename');

gulp.task('js', function (done) {
  gulp.src('./client/source/js/*.js')
    .pipe(include())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./client/public/js'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch('./client/source/js/*.js', ['js']);
});
