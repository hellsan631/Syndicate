var loopback      = require('loopback');
var boot          = require('loopback-boot');
var compression   = require('compression');
var path          = require('path');

var app = module.exports = loopback();

// request pre-processing middleware
app.use(compression({ filter: shouldCompress }));

//filter out non-compressable calls
function shouldCompress(req, res) {

  if(typeof req.originalUrl === 'string'){
    if(req.originalUrl.indexOf("api") > -1) {
      return false;
    }
    if(req.originalUrl.indexOf("png") > -1) {
      return false;
    }
    if(req.originalUrl.indexOf("jpg") > -1) {
      return false;
    }
    if(req.originalUrl.indexOf("gif") > -1) {
      return false;
    }
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

//add cache control
app.use(function (req, res, next) {
  if (req.url.match(/^\/(css|js|img|font|png|jpg)\/.+/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400000');
  }
  next();
});

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:

var staticPath = null;

if (process.env.NODE_ENV !== 'production') {
  staticPath = path.resolve(__dirname, '../client/src/');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../client/dist/');
  console.log("Running app in production mode");
}

app.use(
  loopback.static(staticPath)
);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');

    console.log('Web server listening at: %s', baseUrl);

    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
