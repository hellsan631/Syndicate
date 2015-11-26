// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var path        = require('path');
var es          = require('event-stream');
var spawn 			= require('cross-spawn'); //use cross-spawn on windows

var gulp        = require('gulp');
var watch 			= require('gulp-watch');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var changed 		= require('gulp-changed');

// Run sass alongside burbon (fastest way of sass compiling)
var sass        = require('gulp-sass');
var neat        = require('node-neat').includePaths;
var sourcemaps 	= require('gulp-sourcemaps');

// JS/CSS Injection Related Files
var inject      = require('gulp-inject');
var bowerFiles  = require('main-bower-files');
var angularSort = require('gulp-angular-filesort');

// Run A Live-Reload Express server
var gls 			 = require('gulp-live-server');


// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

//The title and icon that will be used for the gulp notifications
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
var serverPath = 'server/server.js';

var bowerOptions = {
  "overrides": {
    "angular-redactor": {
        "main": "angular-redactor-9.x.js"
    }
  }
};

var config = {
	server: {
		reload: [
			sourcePath + '*.html', 			 //index.html
			sourcePath + 'images/*.*',	 //image files
			sourcePath + 'css/*.*',	 		 //css files
			sourcePath + '**/**/*.*',	 //any app files
			sourcePath + 'app/**/**/*.js', //any component/view files
			sourcePath + 'app/**/**/*.html'
		],
		reboot: [
			'server/*.js',
			'server/*.json',
			'server/**/*.js',
			'server/**/*.json'
		]
	},
  sass: {
    target: sourcePath + 'css',
    source: sourcePath + 'css/scss/*.scss'
  },
  inject: {
    target: sourcePath + 'index.html',
    sources: {
      app: {
        css: [
          sourcePath + 'css/styles.css',
					sourcePath + 'app/*.css',
          sourcePath + 'app/**/*.css',
          sourcePath + 'app/**/**/*.css'
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
gulp.task('default', ['server', 'reload']);

//Reloads the gulp process when the gulpfile changes.
gulp.task('reload', function() {
  var p;

  gulp.watch('gulpfile.js', spawnChildren);
  spawnChildren();

  function spawnChildren(e) {

    // kill previous spawned process
    if (p) {
			p.kill();
		}

    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('gulp', ['sass', 'inject', 'watch'], {stdio: 'inherit'});

  }
});

//Watches for changes in files that should be streamed/compiled to browser
gulp.task('watch', function() {

  //We only want to inject files when files are added/deleted, not changed.
	var options = {events: ['add', 'unlink']};
	var injectFn = function() {
			gulp.start('inject');
	};

  watch(
		config.sass.source,
		function(){
			gulp.start('sass');
		}
	);

  //Watch for changes in app related files and inject new ones
	watch(
		config.inject.sources.app.js,
		options,
		injectFn
	);

});

//Run node server alongside gulp watch tasks
gulp.task('server', function() {
	var server = gls.new(serverPath);

  server.start();

	//Trigger live-reload on file changes
	gulp.watch(
		config.server.reload,
		function (file) {
			server.notify.apply(server, [file]);
		}
	);

	//Restart server on server file changes
	gulp.watch(
		config.server.reboot,
		function() {
      server.start.bind(server)();
    }
	);
});

//Injects all css/js files into our index.html src file
gulp.task('inject', function () {

  return gulp.src(config.inject.target)
		.pipe(plumber(onError))
    .pipe(inject(
			gulp.src(bowerFiles(bowerOptions), {read: false}),
			{name: 'bower', relative: true}
		))
    .pipe(inject(
			es.merge(
	      gulp.src(config.inject.sources.app.css),
	      gulp.src(config.inject.sources.app.js).pipe(angularSort())
	    ),
			{relative: true}
		))
    .pipe(gulp.dest(sourcePath));
});

//Builds our sass with burbon/neat
gulp.task('sass', function(){

  return gulp.src(config.sass.source)
		.pipe(changed(config.sass.target))
		//.pipe(sourcemaps.init())
		.pipe(plumber(onError))
    .pipe(sass(
			{ includePaths: ['styles'].concat(neat) }
		))
		.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.target));
});
