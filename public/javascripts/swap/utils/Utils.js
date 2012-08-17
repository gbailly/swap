Utils = function() {
}

Utils.random = new SecureRandom();

Utils.computeRandomNumber = function(lower, upper, systemParams) {
	var delta = upper.subtract(lower).add(BigInteger.ONE);
	var temp = Utils.computeRandomNumberFromBitLength(delta.bitLength() + systemParams.getL_Phi()).mod(delta);
	return temp.add(lower);
};

Utils.computeRandomNumberFromBitLength = function(bitLength) {
	return new BigInteger(bitLength, Utils.random);
};

Utils.expMul = function(product, base, exponent, modulus) {
	var t; // t = base^exponent (mod modulus)

	if(base instanceof BigInteger) {
		if (base.equals(BigInteger.ZERO)) {
			t = BigInteger.ZERO;
		} else if (base.equals(BigInteger.ONE)) {
			t = BigInteger.ONE;
		}	else if (exponent.equals(BigInteger.ZERO)) {
			t = BigInteger.ONE;
		} else if (exponent.equals(BigInteger.ONE)) {
			t = base.mod(modulus);
		} else {
			t = Utils.modPow(base, exponent, modulus);
		}
	} else {
		t = base.modPow(exponent);
	}
	
	if (product == null || product.equals(BigInteger.ONE)) {
		return t;
	}	else if (product.equals(BigInteger.ZERO)) {
		return BigInteger.ZERO;
	}
	
	return product.multiply(t).mod(modulus);
};

Utils.modPow = function(base, exponent, modulus) {
	if (exponent.compareTo(BigInteger.ZERO) < 0) {
		return base.modInverse(modulus).modPow(exponent.abs(), modulus);
	} else {
		return base.modPow(exponent, modulus);
	}
};


if(typeof exports != 'undefined')
	module.exports = Utils;