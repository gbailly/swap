CommitmentOpening = function(capR_0, message, capS, random, n, value, baseList,
		messageList, issuerPubKey) {
	/* The inherited prototype. */
	this.comm = Commitment;
	/** The random value r. */
	this.random = random;

	if (value == null && baseList == null && messageList == null && issuerPubKey == null) {
		this.comm(CommitmentOpening.genVal(capR_0, message, capS, random, n),
				capR_0, capS, n, null); // super()
		/** The value(s) of the message(s) we're committing to. */
		this.messageList = new Array();
		this.messageList.push(message);
	} else if (capR_0 == null && message == null && issuerPubKey == null) {
		this.comm(value, null, capS, n, baseList); // super()
		this.messageList = messageList;
	}
	else if (capR_0 == null && capS == null && n == null && value == null
			&& baseList == null && messageList == null) {
		this.comm(CommitmentOpening.genVal(issuerPubKey.getCapR()[0], message,
			issuerPubKey.getCapS(), random, issuerPubKey.getN()), null, null, null,
			null, issuerPubKey); // super()
		/** The value(s) of the message(s) we're committing to. */
		this.messageList = new Array();
		this.messageList.push(message);
	}
};

CommitmentOpening.prototype = new Commitment();
CommitmentOpening.prototype.constructor = CommitmentOpening;


CommitmentOpening.prototype.getMessageValue = function() {
	return this.messageList[0];
};

CommitmentOpening.prototype.getRandom = function() {
	return this.random;
};

CommitmentOpening.prototype.getMessage = function(i) {
	if (i >= this.numBases || i < 0) {
		return null;
	}
	return this.messageList[i];
};

CommitmentOpening.genVal = function(capR_0, message, capS, random, n) {
	return Utils.expMul(Utils.expMul(null, capR_0, message, n), capS, random, n);
};

CommitmentOpening.genRandom = function(n, l_n) {
	return Utils.computeRandomNumberFromBitLength(l_n - 2);
};


if(typeof exports != 'undefined')
	module.exports = CommitmentOpening;