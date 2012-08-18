Proof = function(challenge, sValueMap, commonValueMap) {
	if (commonValueMap == null)
		commonValueMap = new Object();

	this.challenge = challenge;
	this.sValueMap = sValueMap;
	this.commonValueMap = commonValueMap;
};

Proof.prototype.getSValue = function(name) {
	return this.sValueMap[name];
};

Proof.prototype.getSValues = function() {
	return this.sValueMap;
};

Proof.prototype.getChallenge = function() {
	return this.challenge;
};

Proof.prototype.getCommonValue = function(name) {
	return this.commonValueMap[name];
};

Proof.prototype.getCommonValueMap = function() {
	return this.commonValueMap;
};


if(typeof exports != 'undefined')
	module.exports = Proof;