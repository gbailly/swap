Locations = function() {
};

Locations.BASE_DIR = "resources/strong";
Locations.SYSTEM_PARAMETERS_LOCATION = "/public/SystemParameters.xml";
Locations.GROUP_PARAMETERS_LOCATION = "/public/GroupParameters.xml";
Locations.ISSUER_PUBLIC_KEY_LOCATION = "/public/IssuerPublicKey.xml";
Locations.CREDENTIAL_STRUCTURE_LOCATION = "/public/CredStruct_UtopiaHiddenValues.xml";


Locations.init = function(objectLocation) {
  var objectXMLDoc;
  if(typeof exports == 'undefined') {
    // browser case
    var xhttp;
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    } else { // IE 5/6
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", "/loadxmldoc" + objectLocation, false);
    xhttp.send();
    objectXMLDoc = xhttp.responseXML;
  }
  else {
    // nodeJS case
    var data = null;
    var fn = Locations.BASE_DIR + objectLocation;
    try {
      console.info('Loading ' + fn);
      data = fs.readFileSync(fn, 'utf8');
    }
    catch (err) {
      console.error("There was an error opening the file " + fn);
      console.log(err);
    }
    objectXMLDoc = new DOMParser().parseFromString(data, 'text/xml');
  }
  
  return StructureStore.getInstance().get(objectLocation, objectXMLDoc);
};

Locations.initSystem = function() {
  // init system parameters
  var systemParamsLocation = Locations.SYSTEM_PARAMETERS_LOCATION;
  Locations.init(systemParamsLocation);
  
  // init group parameters
  var groupParamsLocation = Locations.GROUP_PARAMETERS_LOCATION;
  return Locations.init(groupParamsLocation);
	
}

Locations.initIssuer = function(issuerPrivKeyLocation) {
	// init system parameters and group parameters
	Locations.initSystem();

  // load issuer public key
	var issuerPubKeyLocation = Locations.ISSUER_PUBLIC_KEY_LOCATION;
  var issuerPubKey = Locations.init(issuerPubKeyLocation);

  // load issuer private key
  var issuerPrivKey = Locations.init(issuerPrivKeyLocation);
  
  // init credential structure
	var credStructLocation = Locations.CREDENTIAL_STRUCTURE_LOCATION;
  var credStruct = Locations.init(credStructLocation);

  return [new IssuerKeyPair(issuerPrivKey),
		new IssuanceSpec(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct)];
};

Locations.initRecipient = function() {
	// init system parameters and group parameters
	Locations.initSystem();
  
  // init issuer public key
	var issuerPubKeyLocation = Locations.ISSUER_PUBLIC_KEY_LOCATION;
  var issuerPubKey = Locations.init(issuerPubKeyLocation);
  
  // init credential structure
	var credStructLocation = Locations.CREDENTIAL_STRUCTURE_LOCATION;
  var credStruct = Locations.init(credStructLocation);
  
	// create the issuance specification
	return new IssuanceSpec(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct);
};


if(exports != undefined)
  module.exports = Locations;