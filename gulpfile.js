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

// Run sass alongside burbon (fastest way of sass compiling)
var sass        = require('gulp-sass');
var neat        = require('node-neat').includePaths;

// JS/CSS Injection Related Files
var inject      = require('gulp-inject');
var bowerFiles  = require('main-bower-files');
var angularSort = require('gulp-angular-filesort');

// Run A Live-Reload Express server
var gls 			 = require('gulp-live-server');


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
var serverPath = 'server/server.js';

var config = {
	server: {
		reload: [
			sourcePath + '*.html', 			 //index.html
			sourcePath + 'images/*.*',	 //image files
			sourcePath + 'app/**/*.*',	 //any app files
			sourcePath + 'app/**/**/*.*' //any component/view files
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
gulp.task('default', ['server', 'sass', 'inject', 'reload']);


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
    p = spawn('gulp', ['watch'], {stdio: 'inherit'});

  }
});

//Watches for changes in files that should be streamed/compiled to browser
gulp.task('watch', function() {

  watch(
		config.sass.source,
		function(){
			gulp.start('sass');
		}
	);

	watch(
		config.inject.sources.app.js,
		{events: ['add', 'unlink']},
		function(){
			gulp.start('inject');
		}
	);

	watch(
		bowerFiles(),
		{events: ['add', 'unlink']},
		function(){
			gulp.start('inject');
		}
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

	//Restart server on server/server.js changes
	gulp.watch(
		config.server.reboot,
		server.start.bind(server)
	);
});

//Injects all css/js files into our index.html src file
gulp.task('inject', function () {

  return gulp.src(config.inject.target)
    .pipe(inject(
			gulp.src(bowerFiles(), {read: false}),
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
    .pipe(plumber(onError))
    .pipe(sass(
			{ includePaths: ['styles'].concat(neat) }
		))
    .pipe(gulp.dest(config.sass.target));
});
