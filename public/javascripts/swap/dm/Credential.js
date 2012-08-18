Credential = function(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct, capA, e, v, values,
		masterSecret, attributeList) {
	this.issuerPubKeyLocation = issuerPubKeyLocation;
	this.credStructLocation = credStructLocation;
	this.issuerPubKey = issuerPubKey;
	this.credStruct = credStruct;
	
	// Signature
	this.capA = capA;
	this.e = e;
	this.v = v;

	this.masterSecret = masterSecret;
	this.attributeList = attributeList;
	
	if (attributeList == null && values != null) {
		// create attributes using the given information
		this.attributeList = this.credStruct.createAttributes(values);
	}
};

Credential.prototype.getIssuerPubKeyLocation = function() {
	return this.issuerPubKeyLocation;
};

Credential.prototype.getCredStructLocation = function() {
	return this.credStructLocation;
};

Credential.prototype.getIssuerPubKey = function() {
	return this.issuerPubKey;
};

Credential.prototype.getCredStruct = function() {
	return this.credStruct;
};

Credential.prototype.getCapA = function() {
	return this.capA;
};

Credential.prototype.getE = function() {
	return this.e;
};

Credential.prototype.getV = function() {
	return this.v;
};

Credential.prototype.getMasterSecret = function() {
	return this.masterSecret;
};

Credential.prototype.getAttributes = function() {
	return this.attributeList;
};


if(typeof exports != 'undefined')
	module.exports = Credential;