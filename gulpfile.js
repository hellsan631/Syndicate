// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp    = require('gulp');
var inject  = require('gulp-inject');

// --------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------

var config = {
  inject: {
    target: './client/src/index.html',
    sources: [
      
    ]
  }
}

// --------------------------------------------------------------------
// Tasks
// --------------------------------------------------------------------

gulp.task('inject', function () {
  var target  = gulp.src('./client/src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});
