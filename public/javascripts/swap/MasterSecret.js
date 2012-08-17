MasterSecret = function(value, groupParams, nymMap, domNymMap) {
	/** Group parameters. */
	this.groupParams = groupParams;
	/** Master secret key. */
	this.value = value;
	if(value == null) {
		this.value = Utils.computeRandomNumberFromBitLength(groupParams.getSystemParams().getL_rho());
	}
	/** List of all nyms that the user generated using this master secret. */
	this.nymMap = (nymMap == null ? new Object() : nymMap);
	/** Commitment for a nyms. */
	this.nymTildeMap = new Object();
	/** Domain pseudonym. */
	this.domNymMap = (domNymMap == null ? new Object() : domNymMap);
	/** Commitment for the domain pseudonym. */
	this.domNymTildeMap = new Object();
};

MasterSecret.prototype.getValue = function() {
	return this.value;
};

MasterSecret.prototype.setNymMap = function(nymMap) {
	this.nymMap = nymMap;
};

MasterSecret.prototype.setNymTildeMap = function(nymTildeMap) {
	this.nymTildeMap = nymTildeMap;
};

MasterSecret.prototype.setDomNymTildeMap = function(domNymTildeMap) {
	this.domNymTildeMap = domNymTildeMap;
};

if(typeof exports != 'undefined')
	module.exports = MasterSecret;