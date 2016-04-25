/**
 * Created by shmuel-d on 22.2.2016.
 */
var gulp = require('gulp');

var sass = require('gulp-sass');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./style/css/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});