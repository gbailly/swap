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

MasterSecret.prototype.setMTilde_1 = function(mTilde_1) {
	this.mTilde_1 = mTilde_1;
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

MasterSecret.prototype.getNymTilde = function(nymName) {
	// TODO (pbi): remove 'name' field in nyms
	var nymTilde = new Nym(this.groupParams, this.mTilde_1, " ");
	this.nymTildeMap[nymName] = nymTilde;
	return nymTilde.getNym();
};

/**
 * @return T-Value of the domain pseudonym. NOT TESTED!!
 */
MasterSecret.prototype.getDomNymTilde = function(domain) {
	var domNym = this.domNymMap[domain];
	if (domNym == null)
		return null;
	var domNymTilde = this.domNymTildeMap[domain];
	if (domNymTilde == null) {
		var nym = Utils.expMul(null, domNym.getG_dom(), this.mTilde_1,
				this.groupParams.getCapGamma());
		domNymTilde = new DomNym(this.groupParams, nym, domNym.getG_dom());
		this.domNymTildeMap[domain] = domNymTilde;
	}
	return domNymTilde;
};

MasterSecret.prototype.getMHat = function(mTilde_1, challenge) {
	this.challenge = challenge;
	if (mTilde_1 == null)
		mTilde_1 = this.mTilde_1;
	return Utils.computeResponse(mTilde_1, challenge, this.value);
};

MasterSecret.prototype.getRHat = function(nymName) {
	var nym = this.nymMap[nymName];
	// TODO (frp): step 2.1 in ProvePseudonym
	var rHat = Utils.computeResponse(this.nymTildeMap[nymName].getRandom(),
			this.challenge, nym.getRandom());
	// TODO spec says that rHat is to compute in Z, it does not say
	// in Z_rho.
	// rHat = rHat.mod(issuerPublicKey.getGroupParams().getRho());
	return rHat;
};


if(typeof exports != 'undefined')
	module.exports = MasterSecret;