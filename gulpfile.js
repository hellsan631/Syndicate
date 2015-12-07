// --------------------------------------------------------------------
// DEVELOPMENT PLUGINS
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
// BUILD PLUGINS
// --------------------------------------------------------------------

var concat      = require('gulp-concat');

//JS Modules
var uglify      = require('gulp-uglify');
var lbAngular   = require('gulp-loopback-sdk-angular');

//HTML Modules
var htmlmin     = require('gulp-htmlmin');
var cachebust   = require('gulp-cache-bust');
var rename      = require('gulp-rename');

//CSS Modules
var nano        = require('gulp-cssnano');

//images
var imagemin 		= require('gulp-imagemin');
var pngquant 		= require('imagemin-pngquant');

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
          sourcePath + 'app/**/**/*.css',
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
// BUILD Tasks
// --------------------------------------------------------------------
var destPath  = './client/dist/';
var destIndex = destPath + 'index.html';

var build = {
	css: [
		sourcePath + 'css/*.css',
		sourcePath + 'app/**/*.css'
	],
	js: [
		sourcePath + 'app/*.js',
		sourcePath + 'app/**/*.js',
		sourcePath + 'app/**/**/*.js'
	],
	html: [
    sourcePath + 'app/**/*.html',
		sourcePath + 'app/**/**/*.html',
	],
	images: [
		sourcePath + 'images/*.*'
	]
};

var dest = {
	imagesPath: destPath + 'images/',
	cssPath: destPath + 'css/',
	cssVendorFile: 'vendor.min.css',
	cssFile: 'app.min.css',
	jsPath: destPath + 'app/',
	jsVendorFile: 'vendor.min.js',
	jsFile: 'app.min.js',
	htmlPath: destPath + 'app'
};

var htmlOpts = {
  collapseWhitespace: true
};

var jsOpts = {
	mangle: false
};

var cacheOpts = {
	type: 'timestamp'
};

var buildJSOptions = bowerOptions;
buildJSOptions.filter = /\.js$/i;

var bowerJS = bowerFiles(buildJSOptions);

var bowerCSS = bowerFiles({
    filter: /\.css$/i
});

gulp.task('build', ['build:inject', 'build:images'], function() {
	return gulp.src(build.html)
		.pipe(cachebust(cacheOpts))
		.pipe(gulp.dest(dest.htmlPath));
});

gulp.task('build:inject', ['move:index','build:js', 'build:css'], function(){
	return gulp.src(destIndex)
		.pipe(inject(
			gulp.src([dest.cssPath + dest.cssFile, dest.jsPath + dest.jsFile], {read: false}),
			{relative: true}
		))
		.pipe(inject(
			gulp.src([dest.cssPath + dest.cssVendorFile, dest.jsPath + dest.jsVendorFile], {read: false}),
			{name: 'bower', relative: true}
		))
    .pipe(gulp.dest(destPath));
});

gulp.task('build:css', ['build:css:vendor', 'build:css:app']);

gulp.task('build:css:vendor', function(){
	return gulp.src(bowerCSS)
    .pipe(plumber(onError))
    .pipe(concat(dest.cssVendorFile))
    .pipe(nano())
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:css:app', ['sass'], function(){
	return gulp.src(build.css)
    .pipe(plumber(onError))
    .pipe(concat(dest.cssFile))
    .pipe(nano())
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:js', ['build:js:vendor', 'build:js:app']);

gulp.task('build:js:vendor', function(){
	return gulp.src(bowerJS)
    .pipe(plumber(onError))
    .pipe(uglify())
    .pipe(concat(dest.jsVendorFile))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('build:js:app', ['lbng'], function(){
	return gulp.src(build.js)
	  .pipe(angularSort())
    .pipe(plumber(onError))
    .pipe(uglify(jsOpts))
    .pipe(concat(dest.jsFile))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('move:index', ['move:angular'], function(){
	return gulp.src(config.inject.target)
		.pipe(gulp.dest(destPath));
});

gulp.task('move:angular', function(){
	return gulp.src(build.html)
	  .pipe(htmlmin(htmlOpts))
		.pipe(gulp.dest(dest.htmlPath));
});

gulp.task('lbng', function() {
	return gulp.src(serverPath)
		.pipe(plumber(onError))
		.pipe(lbAngular())
		.pipe(rename('lb-services.js'))
		.pipe(gulp.dest(sourcePath + 'app/services'));
});

gulp.task('build:images', function() {
  return gulp.src(build.images)
    .pipe(imagemin({
        progressive: true,
        use: [pngquant()]
    }))
    .pipe(gulp.dest(dest.imagesPath));
});

// --------------------------------------------------------------------
// DEVELOPMENT Tasks
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
