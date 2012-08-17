IssuanceSpec = function(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct) {
	this.issuerPubKeyLocation = issuerPubKeyLocation;
	this.credStructLocation = credStructLocation;
	this.issuerPubKey = issuerPubKey;
	this.credStruct = credStruct;
};

/** Index of the public key base where the master secret is signed. */
IssuanceSpec.MASTER_SECRET_INDEX = 0;
/** Name of the master secret attribute. */
IssuanceSpec.MASTER_SECRET_NAME = "master_secret";

/** Name of the s-value to be used when stored to the additional values map. */
IssuanceSpec.s_e = "s_e";
IssuanceSpec.vHatPrime = "vHatPrime";
IssuanceSpec.rHat = "rHat";


IssuanceSpec.prototype.getIssuerPubKeyLocation = function() {
	return this.issuerPubKeyLocation;
};

IssuanceSpec.prototype.getCredStructLocation = function() {
	return this.credStructLocation;
};

IssuanceSpec.prototype.getPublicKey = function() {
	return this.issuerPubKey;
};

IssuanceSpec.prototype.getCredentialStructure = function() {
	return this.credStruct;
};

IssuanceSpec.prototype.getContext = function() {
	if (this.context == null)
		this.context = Utils.computeContext(this.issuerPubKey);
	return this.context;
};

IssuanceSpec.prototype.setContext =  function(context) {
	this.context = context;
};


if(typeof exports != 'undefined')
	module.exports = IssuanceSpec;