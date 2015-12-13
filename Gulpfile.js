var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('src/tsconfig.json');

var paths = {
  src: 'src/**/*.ts',
  dist: './dist'
};

gulp.task('default', function() {
  return gulp.src(paths.src)
    .pipe(ts(tsProject))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
  return gulp.watch(paths.src, ['default']);
});
