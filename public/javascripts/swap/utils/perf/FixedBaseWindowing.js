/*
 * Copyright 2012 Guillaume Bailly
 * 
 * This file is part of SW@P.
 * 
 * SW@P is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * SW@P is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with SW@P.  If not, see <http://www.gnu.org/licenses/>.
 */

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