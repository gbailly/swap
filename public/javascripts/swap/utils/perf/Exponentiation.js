// object = base or FixedBaseWindowing
Exponentiation = function(object, exponent, modulus) {
	this.base = null;
	this.exponent = exponent;
	this.modulus = null;
	this.fixedBaseWindowing = null;
	if(modulus != null) {
		this.base = object;
		this.modulus = modulus;
	}
	else {
		this.fixedBaseWindowing = object;
	}
};

Exponentiation.prototype.getBase = function() {
	return this.base;
};

Exponentiation.prototype.getExponent = function() {
	return this.exponent;
};

Exponentiation.prototype.getModulus = function() {
	return this.modulus;
};

Exponentiation.prototype.getFixedBaseWindowing = function() {
	return this.fixedBaseWindowing;
};


if(typeof exports != 'undefined')
	module.exports = Exponentiation;