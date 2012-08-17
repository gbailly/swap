IssuerPrivateKey = function(issuerPublicKey, n, p, pPrime, q, qPrime) {
	/** The issuer public key. */
	this.issuerPubKey = issuerPublicKey;
	/** Modulus <tt>n = p*q</tt>. */
	this.n = n;
	/** Safe prime <tt>p = 2*p' + 1</tt>. */
	this.p = p;
	/** Safe prime <tt>p'</tt>. */
	this.pPrime = pPrime;
	/** Safe prime <tt>q = 2*q' + 1</tt>. */
	this.q = q;
	/** Safe prime <tt>q'</tt>. */
	this.qPrime = qPrime;
};

IssuerPrivateKey.prototype.getPublicKey = function() {
	return this.issuerPubKey;
};

IssuerPrivateKey.prototype.getPublicKeyLocation = function() {
	return this.issuerPubKeyLocation;
};

IssuerPrivateKey.prototype.getN = function() {
	return this.n;
};

IssuerPrivateKey.prototype.getP = function() {
	return this.p;
};

IssuerPrivateKey.prototype.getPPrime = function() {
	return this.pPrime;
};

IssuerPrivateKey.prototype.getQ = function() {
	return this.q;
};

IssuerPrivateKey.prototype.getQPrime = function() {
	return this.qPrime;
};

IssuerPrivateKey.prototype.computePPrimeQPrime = function() {
	return this.pPrime.multiply(this.qPrime);
};


if(typeof exports != 'undefined')
	module.exports = IssuerPrivateKey;