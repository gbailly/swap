
/**
 * Module dependencies.
 */

var express = require('express');
fs          = require('fs');

// load library
var Locations           = require('./public/javascripts/credsystem/utils/Locations.js');


app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.register('.html', require('ejs'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// init locations
fileLocation = Locations.BASE_DIR + '/';


// Routes

require('./server/home.js');
require('./server/setup.js');
require('./server/utils.js');


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
