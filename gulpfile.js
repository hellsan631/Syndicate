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

var vendorPath = 'client/src/vendor/';
var sourcePath = 'client/src/';

var config = {
  sass: {
    target: sourcePath + 'css',
    source: sourcePath + 'css/scss/*.scss'
  },
  inject: {
    target: sourcePath + 'index.html',
    sources: {
      vendor: {
        css: [
          vendorPath + 'Materialize/dist/css/materialize.css',
        ],
        js: [
          vendorPath + 'jquery/dist/jquery.js',
          vendorPath + 'Materialize/dist/js/materialize.js',
          vendorPath + 'angular/angular.js',
          vendorPath + 'angular-animate/angular-animate.js',
          vendorPath + 'angular-materialize/src/angular-materialize.js',
          vendorPath + 'angular-redactor/angular-redactor-9.x.js',
          vendorPath + 'angular-resource/angular-resource.js',
          vendorPath + 'angular-sanitize/angular-sanitize.js',
          vendorPath + 'angular-ui-router/release/angular-ui-router.js'
        ]
      },
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

gulp.task('inject', function () {
  return gulp.src(inject.target)
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(inject(es.merge(
      gulp.src(inject.sources.app.css),
      gulp.src(inject.sources.app.js).pipe(angularSort())
    )))
    .pipe(gulp.dest(sourcePath));
});

gulp.task('watch', ['watch-sass'], function() {

  //watch .scss files
  return gulp.watch(config.sass.source, ['watch-sass']);

});

gulp.task('watch-sass', function(){
  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass({
      includePaths: ['styles'].concat(neat)
    }))
    .pipe(gulp.dest(config.sass.target));
});
