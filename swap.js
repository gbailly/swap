// load modules
var express = require('express');
fs          = require('fs');
DOMParser   = require('xmldom').DOMParser;

// load dependencies
prng_newstate = require('./public/javascripts/libraries/jsbn/prng4.js');
BigInteger    = require('./public/javascripts/libraries/jsbn/jsbn.js');
SecureRandom  = require('./public/javascripts/libraries/jsbn/rng.js');
CryptoJS      = require('./public/javascripts/libraries/crypto-js/sha256.js');

// load library
var Attribute           = require('./public/javascripts/swap/dm/Attribute.js');
var AttributeStructure  = require('./public/javascripts/swap/dm/structure/AttributeStructure.js');
var CredentialStructure = require('./public/javascripts/swap/dm/structure/CredentialStructure.js');
var GroupParameters     = require('./public/javascripts/swap/utils/GroupParameters.js');
var IssuanceSpec        = require('./public/javascripts/swap/issuance/IssuanceSpec.js');
var IssuerKeyPair       = require('./public/javascripts/swap/key/IssuerKeyPair.js');
var IssuerPrivateKey    = require('./public/javascripts/swap/key/IssuerPrivateKey.js');
var IssuerPublicKey     = require('./public/javascripts/swap/key/IssuerPublicKey.js');
var Parser              = require('./public/javascripts/swap/utils/Parser.js');
var StructureStore      = require('./public/javascripts/swap/utils/StructureStore.js');
var SystemParameters    = require('./public/javascripts/swap/utils/SystemParameters.js');

// load credential system
var Locations           = require('./public/javascripts/credsystem/utils/Locations.js');


app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.register('.html', require('ejs'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// init locations
fileLocation = Locations.BASE_DIR;
issuerPrivKeyLocation = "strong/private/IssuerPrivateKey.xml";


// Routes

require('./server/home.js');
require('./server/setup.js');
require('./server/issue.js');
require('./server/utils.js');


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
