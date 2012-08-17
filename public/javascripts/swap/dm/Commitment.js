Commitment = function(value, capR_0, capS, n, baseList, issuerPubKey) {
	this.value = value;
	if(capR_0 != null && baseList == null && issuerPubKey == null) {
		this.capS = capS;
		this.n = n;
		this.numBases = 1;
		this.baseList = new Array();
		this.baseList.push(capR_0);
	}
	else if(capR_0 == null && baseList != null && issuerPubKey == null) {
		this.capS = capS;
		this.n = n;
		this.numBases = baseList.length;
		this.baseList = baseList;
	}
	else if(capR_0 == null && capS == null && n == null && baseList == null && issuerPubKey != null) {
		this.capS = issuerPubKey.getCapS();
		this.n = issuerPubKey.getN();
		this.numBases = 1;
		this.baseList = new Array();
		this.baseList.push(issuerPubKey.getCapR()[0]);
	}
};

Commitment.prototype.getCommitmentValue = function() {
	return this.value;
}

Commitment.prototype.getCapR = function() {
	return this.baseList[0];
};

Commitment.prototype.getCapS = function() {
	return this.capS;
};

Commitment.prototype.getN = function() {
	return this.n;
};

Commitment.prototype.getNumBases = function() {
	return this.numBases;
};

Commitment.prototype.getCommitment = function() {
	return this.value;
};

Commitment.prototype.getMessageBase = function(i) {
	if (i >= this.numBases || i < 0) {
		return null;
	}
	return this.baseList[i];
};

Commitment.computeCommitment = function(groupParams, m, r) {
	var g = groupParams.getG();
	var h = groupParams.getH();
	var capGamma = groupParams.getCapGamma();

	return Utils.expMul(Utils.expMul(null, g, m, capGamma), h, r, capGamma);
};


if(typeof exports != 'undefined')
	module.exports = Commitment;