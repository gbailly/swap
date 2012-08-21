FixedBaseWindowing = function(base, exponentBitLength, modulus, groupElements) {
	this.base = base;
	this.exponentBitLength = exponentBitLength;
	this.modulus = modulus;
	this.groupElements = groupElements;
};

FixedBaseWindowing.DIGIT_WIDTH = 1; // # bits to represent one exponent digit
FixedBaseWindowing.H = Math.pow(2, FixedBaseWindowing.DIGIT_WIDTH); // base 2

FixedBaseWindowing.prototype.getBase = function() {
	return this.base;
};

FixedBaseWindowing.prototype.getExponentBitLength = function() {
	return this.exponentBitLength;
};

FixedBaseWindowing.prototype.getModulus = function() {
	return this.modulus;
};

FixedBaseWindowing.prototype.getGroupElements = function() {
	return this.groupElements;
};

FixedBaseWindowing.prototype.modPow = function(exponent) {
	var capA = BigInteger.ONE;
	var capB = BigInteger.ONE;
	
	var isNegative = false;
	if(exponent.compareTo(BigInteger.ZERO) < 0) {
		exponent = exponent.abs();
		isNegative = true;
	}

	for ( var j = FixedBaseWindowing.H - 1; j >= 1; j--) {
		var bitMask = BigInteger.ONE;
		var temp = exponent.clone();
		var i = 0;
		while (!temp.equals(BigInteger.ZERO) && i < this.groupElements.length) {
			if (temp.and(bitMask).equals(BigInteger.ONE))
				capB = capB.multiply(this.groupElements[i]).mod(this.modulus);
			temp = temp.shiftRight(1);
			i++;
		}
		capA = capA.multiply(capB).mod(this.modulus);
	}
	if(isNegative)
		capA = capA.modInverse(this.modulus);
	
	return capA;
};


if(typeof exports != 'undefined')
	module.exports = FixedBaseWindowing;