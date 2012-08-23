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
 * 
 */

Utils = function() {
}


Utils.random = new SecureRandom();


Utils.isInInterval = function(value, lowerBound, upperBound) {
	return (lowerBound.compareTo(value) <= 0 && value.compareTo(upperBound) <= 0);
};

Utils.isInIntervalSymmetric = function(value, bitLength) {
	return value.bitLength() <= bitLength;
};

Utils.computeRandomNumber = function(lower, upper, systemParams) {
	var delta = upper.subtract(lower).add(BigInteger.ONE);
	var temp = Utils.computeRandomNumberFromBitLength(delta.bitLength() + systemParams.getL_Phi()).mod(delta);
	return temp.add(lower);
};

Utils.computeRandomNumberFromBitLength = function(bitLength) {
	return new BigInteger(bitLength, Utils.random);
};

Utils.computeRandomNumberSymmetric = function(bitLength) {
	var temp;
	do {
		temp = new BigInteger(bitLength + 1, Utils.random);
		// 0 <= temp <= 2^(bitLength+1) - 1
		temp = temp.subtract(BigInteger.ONE.shiftLeft(bitLength)).add(
				BigInteger.ONE); // temp = temp - 2^bitLength + 1
		// -2^bitLength+1 <= temp <= 2^bitLength
	} while (temp.bitLength() > bitLength);

	// -2^bitLength+1 <= temp <= 2^bitLength-1
	return temp;
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

Utils.multiExpMul = function(expoList, modulus) {
	var accu = BigInteger.ONE;
	var res;
	
	for ( var i = 0; i < expoList.length; i++) {
		var expo = expoList[i];
		if(expo.getModulus() != null) {
			// normal case
			var base = expo.getBase();
			var exponent = expo.getExponent();
			res = Utils.modPow(base, exponent, modulus);
		}
		else {
			// fixed base windowing case
			var fixedBaseWindowing = expo.getFixedBaseWindowing();
			var exponent = expo.getExponent();
			res = fixedBaseWindowing.modPow(exponent);
		}	
		// multiply the result to the accumulator
		accu = accu.multiply(res).mod(modulus);
	}
	return accu;
};

Utils.encodeDate = function(date) {
	var referenceDate = new Date("1900/01/01");

	var dateMillisTemp = Date.parse(date);
	var dateMillis = new BigInteger("" + Math.abs(dateMillisTemp));
	if (dateMillisTemp < 0) {
		dateMillis = dateMillis.negate();
	}

	var referenceDateMillisTemp = Date.parse(referenceDate);
	var referenceDateMillis = new BigInteger("" + Math.abs(referenceDateMillisTemp));
	if (referenceDateMillisTemp < 0) {
		referenceDateMillis = referenceDateMillis.negate();
	}

	var diffMillis = dateMillis.subtract(referenceDateMillis).abs();
	var diffDays = diffMillis.divide(new BigInteger("86400000"));

	return diffDays;
};

Utils.computeContext = function(issuerPubKey) {
	var groupParams = issuerPubKey.getGroupParams();
	var contextVector = new Array();
	Utils.computeKeyContext(issuerPubKey, contextVector);
	Utils.computeGroupParamsContext(groupParams, contextVector);

	return Utils.hashOf1(groupParams.getSystemParams().getL_H(), contextVector);
};

Utils.computeKeyContext = function(issuerPubKey, contextVector) {
	var capR = issuerPubKey.getCapR();

	contextVector.push(issuerPubKey.getCapS());
	contextVector.push(issuerPubKey.getCapZ());

	for ( var i = 0; i < capR.length; i++)
		contextVector.push(capR[i]);
};

Utils.computeGroupParamsContext = function(groupParams, contextVector) {
	contextVector.push(groupParams.getG());
	contextVector.push(groupParams.getH());
	contextVector.push(groupParams.getRho());
	contextVector.push(groupParams.getCapGamma());
};

Utils.computeFSChallenge = function(systemParams, context, capU, attrStructs,
		values, nym, domNym, capUTilde, capCTilde, nymTilde, domNymTilde, n1) {
	var nymError = (nym == null && nymTilde != null)
			|| (nym != null && nymTilde == null);
	var domNymError = (domNym == null && domNymTilde != null)
			|| (domNym != null && domNymTilde == null);

	if (nymError || domNymError) {
		alert("Nym or domNym error");
	}

	// allocate the array of BigInteger
	var array = new Array();

	array.push(context);
	array.push(capU);
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		// the committed value!
		if (attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
			var committedValue = values.get(attrStruct.getName()).getContent()
					.getCommitment();
			array.push(committedValue);
		}
	}

	if (nym != null)
		array.push(nym);
	if (domNym != null)
		array.push(domNym);

	array.push(capUTilde);

	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		// the committed value!
		if (attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
			var cTilde = capCTilde[attrStruct.getName()];
			array.push(cTilde);
		}
	}

	if (nym != null)
		array.push(nymTilde);
	if (domNym != null)
		array.push(domNymTilde);

	array.push(n1);

	// hash the array of BigIntegers
	return Utils.hashOf1(systemParams.getL_H(), array);
};

Utils.computeFSChallenge2 = function(systemParams, context, capQ, capA, capATilde, n2) {
	// allocate the array of BigInteger
	var array = new Array();
	
	array.push(context);
	array.push(capQ);
	array.push(capA);
	array.push(capATilde);
	array.push(n2);

	// hash the array of BigIntegers
	return Utils.hashOf1(systemParams.getL_H(), array);
};

Utils.computeChallenge = function(systemParams, context, commonValueList, n1) {
	// TODO merge with the computeFSChallenge()

	var array = new Array();

	array.push(context);

	for ( var i in commonValueList) {
		array.push(commonValueList[i]);
		/*if(typeof exports != 'undefined') {
			console.log(commonValueList[i].toJSONString());
		} else {
			document.write("<p>"+commonValueList[i].toJSONString()+"</p>");
		}*/
	}
	
	array.push(n1);

	return Utils.hashOf1(systemParams.getL_H(), array);
};

Utils.hashOf1 = function(l_H, array) {
	var asn1representation = ASN1.encode(array);
	var asn1Hex = Utils.byteArrayToHexString(asn1representation);
	return new BigInteger(CryptoJS.SHA256(asn1Hex).toString(), 16);
};

Utils.byteArrayToHexString = function(array) {
	var hexString = "";
	for ( var i = 0; i < array.length; i++)
		hexString += Utils.convertByteToHex(array[i]);
	return hexString;
};

Utils.convertByteToHex = function(element) {
	var hexNumber = (element & 0xFF).toString(16);
	if (hexNumber.length == 1)
		hexNumber = "0" + hexNumber;
	return hexNumber;
};

Utils.computeResponse = function(vTilde, c, v) {
	return vTilde.add(c.multiply(v));
};

Utils.stringEndsWith = function(string, suffix) {
	return string.indexOf(suffix, string.length - suffix.length) != -1;
};

Utils.chooseE = function(systemParams) {
	var offset = BigInteger.ONE.shiftLeft(systemParams.getL_e() - 1);
	do {
		var e = Utils.computeRandomNumberFromBitLength(systemParams.getL_ePrime() - 1);
		e = e.add(offset);
	} while (!e.isProbablePrime(systemParams.getL_pt()));
	return e;
};


if(typeof exports != 'undefined')
	module.exports = Utils;