// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var sass        = require('gulp-sass');
var notify      = require('gulp-notify');
var neat        = require('node-neat').includePaths;
var path        = require('path');
var inject      = require('gulp-inject');
var bowerFiles  = require('main-bower-files');
var es          = require('event-stream');
var angularSort = require('gulp-angular-filesort');

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

var onError = {
  errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: 'Error: <%= error.message %>'
	})
};

// --------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------

var sourcePath = './client/src/';
var vendorPath = sourcePath + 'vendor/';

var config = {
  sass: {
    target: sourcePath + 'css',
    source: sourcePath + 'css/scss/*.scss'
  },
  inject: {
    target: sourcePath + 'index.html',
    sources: {
      app: {
        css: [
          sourcePath + 'css/styles.css'
        ],
        js: [
          sourcePath + 'app/*.js',
          sourcePath + 'app/**/*.js',
          sourcePath + 'app/**/**/*.js'
        ]
      }
    }
  }
};

// --------------------------------------------------------------------
// Tasks
// --------------------------------------------------------------------

//Default gulp task for dev purposes
gulp.task('default', ['watch', 'inject'], function() {

});

//Injects all css/js files into our index.html src file
gulp.task('inject', function () {

  return gulp.src(config.inject.target)
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
    .pipe(inject(es.merge(
      gulp.src(config.inject.sources.app.css),
      gulp.src(config.inject.sources.app.js).pipe(angularSort())
    ), {relative: true}))
    .pipe(gulp.dest(sourcePath));
});

//Watches for changes in sass files
gulp.task('watch', ['watch-sass'], function() {

  return gulp.watch(config.sass.source, ['watch-sass']);
});

//Builds our sass with burbon/neat
gulp.task('watch-sass', function(){

  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass({
      includePaths: ['styles'].concat(neat)
    }))
    .pipe(gulp.dest(config.sass.target));
});
