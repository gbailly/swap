Recipient = function(issuanceSpec, pseudonym, pseudonymName, domNymName, masterSecret, values) {
	if (masterSecret == null || issuanceSpec == null) {
		alert("Recipient instantiated without the necessary values.");
	}
	/** Issuance specification for the credential that is retrieved. */
	this.issuanceSpec = issuanceSpec;
	/** Convenience: Issuer public key. */
	this.issuerPubKey = issuanceSpec.getPublicKey();
	/** Convenience: Group parameters. */
	this.groupParams = this.issuerPubKey.getGroupParams();
	/** Convenience: System parameters. */
	this.systemParams = this.groupParams.getSystemParams();
	/** Pseudonym... */
	this.nym = pseudonym;
	/** Master secret. */
	this.masterSecret = masterSecret;
	/** Name of the pseudonym. */
	this.nymName = pseudonymName;
	/** Domain pseudonym... */
	this.domNymName = domNymName;
	/** Credential structure. */
	this.credStruct = issuanceSpec.getCredentialStructure();
	/** Values needed during the issuance protocol. */
	this.values = values;
	this.values.add(IssuanceSpec.MASTER_SECRET_NAME, masterSecret);
};

Recipient.prototype.round1 = function(message) {
	var nonce1 = message.getIssuanceElement(IssuanceProtocolValues.nonce);
	var attrStructs = this.credStruct.getAttributeStructures();

	// elements from issuer public key
	var capS = this.issuerPubKey.getCapS();
	var n = this.issuerPubKey.getN();
	var capR = this.issuerPubKey.getCapR();
	
	var bitLength;
	var expoList;

	// 1.1 choose v' in +/- {0,1}^(l_n + l_Phi)
	bitLength = this.systemParams.getL_n() + this.systemParams.getL_Phi();
	this.vPrime = Utils.computeRandomNumberSymmetric(bitLength);
	
	// 1.2 compute capU
	expoList = new Array();
	if(Constants.FAST_EXPO) {
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["S"], this.vPrime, null));
		this.addAttrExpos(attrStructs, this.fixedBaseWindowingMap, n, expoList);
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["R_" + IssuanceSpec.MASTER_SECRET_INDEX], this.masterSecret.getValue(), null));
	} else {
		expoList.push(new Exponentiation(capS, this.vPrime, n));
		this.addAttrExpos(attrStructs, capR, n, expoList);
		expoList.push(new Exponentiation(capR[IssuanceSpec.MASTER_SECRET_INDEX], this.masterSecret.getValue(), n));
	}	
	this.capU = Utils.multiExpMul(expoList, n);
	
	// 1.3.0.0
	// Random values for the hidden/committed attributes used during a proof.
	this.mTildes = new Object();
	this.setMTildes(attrStructs);
	bitLength = this.systemParams.getL_m() + this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
	this.mTildes[IssuanceSpec.MASTER_SECRET_NAME] = Utils.computeRandomNumberSymmetric(bitLength);
	this.masterSecret.setMTilde_1(this.mTildes[IssuanceSpec.MASTER_SECRET_NAME]);

	// 1.3.0.1
	var nymTilde = null;
	if(this.nym != null) {
		nymTilde = this.masterSecret.getNymTilde(this.nymName);
	}
	//document.write("<p>nymTilde:" + nymTilde + "</p>");

	// 1.3.0.2 TODO
	var domNymTilde = null;
	if(this.domNym != null) {
		domNymTilde = this.masterSecret.getDomNymTilde(this.domNymName).getNym();
	}
	// document.write("<p>" + domNymTilde + "</p>");

	// 1.3.1 compute capUTilde
	bitLength = this.systemParams.getL_n() + 2 * this.systemParams.getL_Phi() + this.systemParams.getL_H();
	var vTildePrime = Utils.computeRandomNumberSymmetric(bitLength);
	// compute capUTilde
	expoList = new Array();
	var capUTilde = null;
	if(Constants.FAST_EXPO) {
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["S"], vTildePrime, null));
		// add tilde values for hidden and committed attributes
		this.addTildeAttrExpos(attrStructs, this.fixedBaseWindowingMap, n, expoList);
		// add tilde value for master secret
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["R_" + IssuanceSpec.MASTER_SECRET_INDEX],
			this.mTildes[IssuanceSpec.MASTER_SECRET_NAME], null));
	} else {
		expoList.push(new Exponentiation(capS, vTildePrime, n));
		// add tilde values for hidden and committed attributes
		this.addTildeAttrExpos(attrStructs, capR, n, expoList);
		// add tilde value for master secret
		expoList.push(new Exponentiation(capR[IssuanceSpec.MASTER_SECRET_INDEX],
			this.mTildes[IssuanceSpec.MASTER_SECRET_NAME], n));
	}
	capUTilde = Utils.multiExpMul(expoList, n);
	
	// 1.3.2 CTilde: may be empty (non-null). We know the commitment opening!
	var capCTilde = this.getCapCTilde(attrStructs);

	// 1.3.3 compute the Fiat-Shamir hash.
	var c = this.computeC(attrStructs, capUTilde, capCTilde, nymTilde, domNymTilde, nonce1);
	
	// 1.3.4 compute the responses
	var vHatPrime = Utils.computeResponse(vTildePrime, c, this.vPrime);
	var sValues = this.getSValues(attrStructs, capCTilde, c);
	sValues[IssuanceSpec.MASTER_SECRET_NAME] = new SValue(this.masterSecret
			.getMHat(this.mTildes[IssuanceSpec.MASTER_SECRET_NAME], c));
	var additionalValues = new Object();
	additionalValues[IssuanceSpec.vHatPrime] = vHatPrime;
	if (this.nym != null) {
		var rHat_nym = this.masterSecret.getRHat(this.nymName);
		additionalValues[IssuanceSpec.rHat] = rHat_nym;
	}

	// 1.3.5
	var proof1 = new Proof(c, sValues, additionalValues, null);

	// 1.4
	this.n2 = Utils.computeRandomNumberFromBitLength(this.systemParams.getL_Phi());

	var issuanceProtocolValues = new Object();
	issuanceProtocolValues[IssuanceProtocolValues.capU] = this.capU;
	issuanceProtocolValues[IssuanceProtocolValues.nonce] = this.n2;

	return new Message(issuanceProtocolValues, proof1, null);
};

Recipient.prototype.addAttrExpos = function(attrStructs, baseStruct, n, expoList) {
	for ( var i =0; i<attrStructs.length; i++) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() != IssuanceMode.KNOWN) {
			var value = this.values.getValue(attrStruct);
			if(Constants.FAST_EXPO) {
				expoList.push(new Exponentiation(baseStruct["R_" + attrStruct.getPubKeyIndex()], value, null));
			} else {
				expoList.push(new Exponentiation(baseStruct[attrStruct.getPubKeyIndex()], value, n));
			}
		}
	}
};

Recipient.prototype.setMTildes = function(attrStructs) {
	var bitLength = this.systemParams.getL_m() + this.systemParams.getL_Phi()
			+ this.systemParams.getL_H() + 1;
	for (var i =0; i<attrStructs.length; i++) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() != IssuanceMode.KNOWN) {
			this.mTildes[attrStruct.getName()] = Utils.computeRandomNumberSymmetric(bitLength);
		}
	}
};

Recipient.prototype.addTildeAttrExpos = function(attrStructs, baseList, n, expos) {
	for ( var i = 0; i<attrStructs.length; i++) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() != IssuanceMode.KNOWN) {
			var mTilde = this.mTildes[attrStruct.getName()];
			if(Constants.FAST_EXPO) {
				expos.push(new Exponentiation(baseList["R_" + attrStruct.getPubKeyIndex()], mTilde, null));
			} else {
				expos.push(new Exponentiation(baseList[attrStruct.getPubKeyIndex()], mTilde, n));
			}
		}
	}
};

Recipient.prototype.getCapCTilde = function(attrStructs) {
	var bitLength = this.systemParams.getL_n() + 2
			* this.systemParams.getL_Phi() + this.systemParams.getL_H();
	var capCTildes = new Object();
	for ( var i =0; i<attrStructs.length; i++) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
			var rTilde = Utils.computeRandomNumberSymmetric(bitLength);
			var name = attrStruct.getName();
			var capC = this.values.get(name).getContent();
			var mTilde = this.mTildes[name];

			// the exponent is set to the mTilde of the attribute which
			// corresponds to the commitment!
			// the attribute's mTilde was set to some random value before.
			var capCTilde = new CommitmentOpening(capC.getCapR(), mTilde, capC
					.getCapS(), rTilde, capC.getN(), null, null, null, null);

			capCTildes[name] = capCTilde;
		}
	}
	return capCTildes;
};

Recipient.prototype.computeC = function(attrStructs, capUTilde, capCTilde,
		nymTilde, domNymTilde, n1) {
	var commitments = new Object();
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
			var name = attrStruct.getName();
			commitments[name] = capCTilde[name].getCommitment();
		}
	}
	
	// TODO
	var domNym = null;
	/*if(this.domNymName != null) {
		domNym = this.masterSecret.loadDomNym(this.domNymName).getNym());
	}*/

	return Utils.computeFSChallenge(this.systemParams, this.issuanceSpec
			.getContext(), this.capU, attrStructs, this.values, this.nym,
			domNym, capUTilde, commitments, nymTilde, domNymTilde, n1);
};

Recipient.prototype.getSValues = function(attrStructs, capCTilde, challenge) {
	var sValues = new Object();
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		var name = attrStruct.getName();

		if (attrStruct.getIssuanceMode() == IssuanceMode.KNOWN)
			continue;

		var mHat = Utils.computeResponse(this.mTildes[name], challenge,
				this.values.getValue(attrStruct));
		sValues[name] = new SValue(mHat);

		if (attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
			var commOpen = this.values.get(name).getContent();
			var commTilde = capCTilde[name];
			var rHat = Utils.computeResponse(commTilde.getRandom(), challenge,
					commOpen.getRandom());
			sValues[name + Constants.DELIMITER + "rHat"] = new SValue(rHat);
		}
	}
	return sValues;
};


if(typeof exports != 'undefined')
	exports = Recipient;