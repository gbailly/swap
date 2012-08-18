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
var ASN1                = require('./public/javascripts/swap/utils/ASN1.js');
var Attribute           = require('./public/javascripts/swap/dm/Attribute.js');
var AttributeStructure  = require('./public/javascripts/swap/dm/structure/AttributeStructure.js');
var Constants           = require('./public/javascripts/swap/utils/Constants.js');
var Commitment          = require('./public/javascripts/swap/dm/Commitment.js');
var CommitmentOpening   = require('./public/javascripts/swap/dm/CommitmentOpening.js');
var CredentialStructure = require('./public/javascripts/swap/dm/structure/CredentialStructure.js');
var DomNym              = require('./public/javascripts/swap/DomNym.js');
var Exponentiation      = require('./public/javascripts/swap/utils/perf/Exponentiation.js');
var GroupParameters     = require('./public/javascripts/swap/utils/GroupParameters.js');
var IssuanceSpec        = require('./public/javascripts/swap/issuance/IssuanceSpec.js');
var Issuer              = require('./public/javascripts/swap/issuance/Issuer.js');
var IssuerKeyPair       = require('./public/javascripts/swap/key/IssuerKeyPair.js');
var IssuerPrivateKey    = require('./public/javascripts/swap/key/IssuerPrivateKey.js');
var IssuerPublicKey     = require('./public/javascripts/swap/key/IssuerPublicKey.js');
var MasterSecret        = require('./public/javascripts/swap/MasterSecret.js');
var Message             = require('./public/javascripts/swap/issuance/Message.js');
var Nym                 = require('./public/javascripts/swap/Nym.js');
var Parser              = require('./public/javascripts/swap/utils/Parser.js');
var Proof               = require('./public/javascripts/swap/proof/Proof.js');
var Recipient           = require('./public/javascripts/swap/issuance/Recipient.js');
var StructureStore      = require('./public/javascripts/swap/utils/StructureStore.js');
var SValue              = require('./public/javascripts/swap/proof/sval/SValue.js');
var SystemParameters    = require('./public/javascripts/swap/utils/SystemParameters.js');
var Utils               = require('./public/javascripts/swap/utils/Utils.js');
var Value               = require('./public/javascripts/swap/dm/Value.js');
var Values              = require('./public/javascripts/swap/dm/Values.js');

// load credential system
                          require('./public/javascripts/credsystem/utils/JSONConverter.js');
var Locations           = require('./public/javascripts/credsystem/utils/Locations.js');
                          require('./public/javascripts/credsystem/utils/Utils.js');


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

// declarations
fixedBaseWindowingMapJSONString = '';


// Routes

require('./server/home.js');
require('./server/setup.js');
require('./server/issue.js');
require('./server/utils.js');


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
