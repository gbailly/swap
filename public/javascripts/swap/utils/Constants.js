Constants = function() {
}

/** Delimiter between the attribute name and its value for set attributes. */
Constants.DELIMITER = ";";

Constants.FOUR = new BigInteger("4");

/** Specifies whether fixed base windowing for exponentiation should be used */
Constants.FAST_EXPO = false;


if(typeof exports != 'undefined')
	module.exports = Constants;