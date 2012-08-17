IssuerPublicKey = function(groupParams, capS, capZ, capR, n) {
	/** Location of the group parameters corresponding to this key */
	this.groupParams = groupParams;
	/** BigInteger <tt>S</tt> as specified in ... */
	this.capS = capS;
	/** BigInteger <tt>Z</tt> as specified in ... */
	this.capZ = capZ;
	/** BigInteger array [<tt>R<sub>1</sub>, ... , R<sub>m</sub></tt>]. Bases for the messages. */
	this.capR = capR;
	/** BigInteger <tt>n</tt>. Modulus. */
	this.n = n;
};

IssuerPublicKey.prototype.getGroupParams = function() {
	return this.groupParams;
};

IssuerPublicKey.prototype.getCapS = function() {
	return this.capS;
};

IssuerPublicKey.prototype.getCapZ = function() {
	return this.capZ;
};

IssuerPublicKey.prototype.getCapR = function() {
	return this.capR;
};

IssuerPublicKey.prototype.getN = function() {
	return this.n;
};


if(typeof exports != 'undefined')
	module.exports = IssuerPublicKey;