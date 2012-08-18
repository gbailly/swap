Issuer = function(keyPair, issuanceSpec, pseudonym, domNym, values) {
	/** Convenience: Group parameters. */
	this.groupParams = keyPair.getPublicKey().getGroupParams();
	/** Convenience: System parameters. */
	this.systemParams = this.groupParams.getSystemParams();
	
	/** Key pair of the issuer. */
	this.keyPair = keyPair;
	/** Specification of the issuing process. */
	this.issuanceSpec = issuanceSpec;
	/** Pseudonym. */
	this.nym = pseudonym;
	/** Domain pseudonym. */
	this.domNym = domNym;
	
	/** Credential structure used for the issuing process. */
	this.credStruct = this.issuanceSpec.getCredentialStructure();
	/** Values for the issuance process (i.e., known attribute values). */
	this.values = values;
};

Issuer.prototype.setFixedBaseWindowingMap = function(fixedBaseWindowingMap) {
	this.fixedBaseWindowingMap = fixedBaseWindowingMap;
};

Issuer.prototype.round0 = function() {
	var issuanceProtocolValues = new Object();
	// choose a random nonce n1 in {0,1}^l_Phi.
	this.nonce1 = Utils.computeRandomNumberFromBitLength(this.systemParams.getL_Phi());
	issuanceProtocolValues[IssuanceProtocolValues.nonce] = this.nonce1;
	return new Message(issuanceProtocolValues, null, null);
};

Issuer.prototype.round2 = function(message) {
	var attrStructs = this.credStruct.getAttributeStructures();
	var capU = message.getIssuanceElement(IssuanceProtocolValues.capU);
	var proof1 = message.getProof();
	var c = proof1.getChallenge();
	var sValues = proof1.getSValues();
	var mHat_1 = sValues[IssuanceSpec.MASTER_SECRET_NAME].getValue();
	var vHatPrime = proof1.getCommonValue(IssuanceSpec.vHatPrime);
	var negC = c.negate(); // TODO
	var capGamma = this.groupParams.getCapGamma();
	var pubKey = this.keyPair.getPublicKey();
	var privKey = this.keyPair.getPrivateKey();
	var capS = pubKey.getCapS();
	var n = pubKey.getN();
	var capR = pubKey.getCapR();
	
	// 2.0.0.1
	var nymHat = null;
	if (this.nym != null) { // NOT TESTED!! // TODO fixed base windowing
		nymHat = Utils.computeCommitment(this.groupParams, mHat_1, proof1
				.getCommonValue(IssuanceSpec.rHat));
		nymHat = Utils.expMul(nymHat, this.nym, negC, capGamma);
	}
	// console.log(nymHat);

	// 2.0.0.2
	var domNymHat = null;
	if (this.domNym != null) { // NOT TESTED!! // TODO fixed base windowing
		domNymHat = Utils.expMul(null, this.domNym.getNym(), negC, capGamma);
		domNymHat = Utils.expMul(domNymHat, this.domnym.getG_dom(), mhat_1,
				capGamma);
	}
	// console.log(domNymHat);

	// 2.0.1 compute capUHat
	var expoList = new Array();
	expoList.push(new Exponentiation(capU, negC, n));
	if(Constants.FAST_EXPO) {
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["S"], vHatPrime, null));
		this.addHatAttrExpos(attrStructs, sValues, this.fixedBaseWindowingMap, n, expoList);
		expoList.push(new Exponentiation(this.fixedBaseWindowingMap["R_" + IssuanceSpec.MASTER_SECRET_INDEX], mHat_1, null));
	} else {
		expoList.push(new Exponentiation(capS, vHatPrime, n));
		this.addHatAttrExpos(attrStructs, sValues, capR, n, expoList);
		expoList.push(new Exponentiation(capR[IssuanceSpec.MASTER_SECRET_INDEX], mHat_1, n));
	}
	var capUHat = Utils.multiExpMul(expoList, n);
	// console.log('capUHat:' + capUHat);

	// 2.0.2 compute capCHat
	var capCHat = this.getCHat(negC, sValues);
	// for (var i in capCHat)
	// console.log('capCHat[' + i + ']:' + capCHat[i]);

	// 2.0.3 compute the Fiat-Shamir hash
	var domNymNym = null;
	if (this.domNym != null) // NOT TESTED!!
		domNymNym = this.domNym.getNym();
	var cHat = Utils.computeFSChallenge(this.systemParams, this.issuanceSpec
			.getContext(), capU, attrStructs, this.values, this.nym, domNymNym,
			capUHat, capCHat, nymHat, domNymHat, this.nonce1);
	 //console.log("cHat:" + cHat.toString());		
	 //console.log("c:" + c.toString());
	
	if (!cHat.equals(c))
		return null;

	// 2.0.4
	// check that vHatPrime has right bit length.
	// document.write("<p>vHatPrime:" + vHatPrime + "</p>");
	var vHatPrimeBitLength = this.systemParams.getL_n() + 2
			* this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
	if (!Utils.isInInterval1(vHatPrime, vHatPrimeBitLength))
		return null;
	// check that mHat and rHat are in correct interval.
	if(!this.checkInterval(sValues))
		return null;

	// 2.1 we can now start generating the signature.

	// 2.1.1 choose e
	var e = Utils.chooseE(this.systemParams);
	// document.write("<p>e:" + e + "</p>");

	// 2.1.2
	// choose vTilde
	var vTilde = Utils.computeRandomNumber4(this.systemParams.getL_v() - 1);
	// compute vPrimePrime
	var vPrimePrime = vTilde.add(BigInteger.ONE.shiftLeft(this.systemParams
			.getL_v() - 1));

	// 2.1.3
	// Q
	var capQ = null;
	if(Constants.FAST_EXPO) {
		capQ = this.computeQ(capS, capU, pubKey.getCapZ(), this.fixedBaseWindowingMap, vPrimePrime, n);
	} else {
		capQ = this.computeQ(capS, capU, pubKey.getCapZ(), capR, vPrimePrime, n);
	}
	
	// A
	var pPrime_qPrime = privKey.computePPrimeQPrime(); // p' * q'
	var eInverse = e.modInverse(pPrime_qPrime); // e^{-1} mod p'q'
	var capA = capQ.modPow(eInverse, n);
	// console.log('capA:' + capA);

	// 2.2.1 compute capATilde
	var r = Utils.computeRandomNumber2(pPrime_qPrime.subtract(BigInteger.ONE),
			this.systemParams).add(BigInteger.ONE);
	var capATilde = capQ.modPow(r, n);
	// document.write("<p>capATilde:" + capATilde + "</p>");

	// 2.2.2 compute challenge
	var nonce2 = message.getIssuanceElement(IssuanceProtocolValues.nonce);
	var cPrime = Utils.computeFSChallenge2(this.systemParams, this.issuanceSpec
			.getContext(), capQ, capA, capATilde, nonce2);
	// document.write("<p>cPrime:" + cPrime + "</p>");

	// 2.2.3
	// compute s_e
	var s_e = r.subtract(cPrime.multiply(eInverse)).mod(pPrime_qPrime);
	// document.write("<p>s_e:" + s_e + "</p>");
	// creating new s-value map
	var sValues = new Object();
	sValues[IssuanceSpec.s_e] = new SValue(s_e);
	// compute p2
	var p2 = new Proof(cPrime, sValues, null, null);

	// 2.3
	var issuanceProtocolValues = new Object();
	issuanceProtocolValues[IssuanceProtocolValues.capA] = capA;
	issuanceProtocolValues[IssuanceProtocolValues.e] = e;
	issuanceProtocolValues[IssuanceProtocolValues.vPrimePrime] = vPrimePrime;
	issuanceProtocolValues[IssuanceProtocolValues.capQ] = capQ;

	return new Message(issuanceProtocolValues, p2, null);
};

Issuer.prototype.addHatAttrExpos = function(attrStructs, sValues, baseStruct, n, expos) {
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() != IssuanceMode.KNOWN) {
			var name = attrStruct.getName();
			var mHat = sValues[name].getValue();
			var keyIndex = attrStruct.getPubKeyIndex();
			if(Constants.FAST_EXPO) {
				expos.push(new Exponentiation(baseStruct["R_" + keyIndex], mHat, null));
			} else {
				expos.push(new Exponentiation(baseStruct[keyIndex], mHat, n));
			}
		}
	}
};

Issuer.prototype.getCHat = function(negChallenge, sValues) {
	var attrStructs = this.credStruct
			.getAttributeStructures(IssuanceMode.COMMITTED);
	var v = new Object();

	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		var name = attrStruct.getName();

		var commitment = this.values.get(name).getContent();
		var comm = commitment.getCommitmentValue();
		var modulus = commitment.getN();

		var expoList = new Array();
		// C_j^{-c} (mod n)
		expoList.push(new Exponentiation(comm, negChallenge, modulus));
		// Z_{j}^{mHat_j} (mod n)
		expoList.push(new Exponentiation(commitment.getCapR(), sValues[name]
				.getValue(), modulus));
		// S_{j}^{rHat_j} (mod n)
		expoList.push(new Exponentiation(commitment.getCapS(), sValues[name
				+ Constants.DELIMITER + "rHat"].getValue(), modulus));

		v[name] = Utils.multiExpMul(expoList, modulus);
	}
	return v;
};

Issuer.prototype.checkInterval = function(values) {
	var bitLength;

	for ( var name in values) {
		if (Utils.stringEndsWith(name, "rHat")) {
			bitLength = this.systemParams.getL_n() + 2
					* this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
		}	else {
			bitLength = this.systemParams.getL_m()
					+ this.systemParams.getL_Phi() + this.systemParams.getL_H() + 2;
		}

		if (!Utils.isInInterval1(values[name].getValue(), bitLength)) {
			return false;
		}
	}
	return true;
};

Issuer.prototype.computeQ = function(capS, capU, capZ, baseStruct, vPrimePrime, n) {
	var expoList = new Array();
	var attrStructs = this.credStruct
			.getAttributeStructures(IssuanceMode.KNOWN);
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		if(Constants.FAST_EXPO) {
			expoList.push(new Exponentiation(baseStruct["R_" + attrStruct.getPubKeyIndex()], this.values.getValue(attrStruct), null));
			expoList.push(new Exponentiation(baseStruct["S"], vPrimePrime, null));
		} else {
			expoList.push(new Exponentiation(baseStruct[attrStruct.getPubKeyIndex()], this.values
					.getValue(attrStruct), n));
			expoList.push(new Exponentiation(capS, vPrimePrime, n));
		}
	}

	var capQ = Utils.multiExpMul(expoList, n);
	capQ = capQ.multiply(capU).remainder(n);
	capQ = capQ.modInverse(n);
	capQ = capQ.multiply(capZ).mod(n);

	return capQ;
};


if(typeof exports != 'undefined')
	module.exports = Issuer;