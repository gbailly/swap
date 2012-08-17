IssuerKeyPair = function(issuerPrivateKey) {
	/** Private key of the issuer. */
	this.issuerPrivKey = issuerPrivateKey;
	/** Public key of the issuer. */
	this.issuerPubKey = issuerPrivateKey.getPublicKey();
};

IssuerKeyPair.prototype.getPrivateKey = function() {
	return this.issuerPrivKey;
};

IssuerKeyPair.prototype.getPublicKey = function() {
	return this.issuerPubKey;
};


if(typeof exports != 'undefined')
	module.exports = IssuerKeyPair;