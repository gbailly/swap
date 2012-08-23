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
	if (this.nym != null) {
		nymHat = Commitment.computeCommitment(this.groupParams, mHat_1, proof1
				.getCommonValue(IssuanceSpec.rHat));
		nymHat = Utils.expMul(nymHat, this.nym, negC, capGamma);
	}

	// 2.0.0.2
	var domNymHat = null;
	if (this.domNym != null) { // NOT TESTED!! // TODO fixed base windowing
		domNymHat = Utils.expMul(null, this.domNym.getNym(), negC, capGamma);
		domNymHat = Utils.expMul(domNymHat, this.domNym.getG_dom(), mHat_1, capGamma);
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

	// 2.0.2 compute capCHat
	var capCHat = this.getCHat(negC, sValues);
	
	// 2.0.3 compute the Fiat-Shamir hash
	var domNymNym = null;
	if (this.domNym != null) { // NOT TESTED!!
		domNymNym = this.domNym.getNym();
	}
	var cHat = Utils.computeFSChallenge(this.systemParams, this.issuanceSpec
			.getContext(), capU, attrStructs, this.values, this.nym, domNymNym,
			capUHat, capCHat, nymHat, domNymHat, this.nonce1);
	
	if (!cHat.equals(c)) {
		return null;
	}

	// 2.0.4
	// check that vHatPrime has right bit length.
	var bitLength = this.systemParams.getL_n() + 2
			* this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
	if (!Utils.isInIntervalSymmetric(vHatPrime, bitLength)) {
		return null;
	}
	// check that mHat and rHat are in correct interval.
	if(!this.checkInterval(sValues)) {
		return null;
	}

	// 2.1 we can now start generating the signature.

	// 2.1.1 choose e
	var e = Utils.chooseE(this.systemParams);
	
	// 2.1.2
	// choose vTilde
	var vTilde = Utils.computeRandomNumberFromBitLength(this.systemParams.getL_v() - 1);
	// compute vPrimePrime
	var vPrimePrime = vTilde.add(BigInteger.ONE.shiftLeft(this.systemParams.getL_v() - 1));

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

	// 2.2.1 compute capATilde
	var pPrimeQPrimeMinus1 = pPrime_qPrime.subtract(BigInteger.ONE);
	var r = Utils.computeRandomNumberFromBitLength(pPrimeQPrimeMinus1.bitLength()
			+ this.systemParams.getL_Phi()).mod(pPrimeQPrimeMinus1).add(BigInteger.ONE);
	var capATilde = capQ.modPow(r, n);
	
	// 2.2.2 compute challenge
	var nonce2 = message.getIssuanceElement(IssuanceProtocolValues.nonce);
	var cPrime = Utils.computeFSChallenge2(this.systemParams, this.issuanceSpec
			.getContext(), capQ, capA, capATilde, nonce2);
	
	// 2.2.3
	// compute s_e
	var s_e = r.subtract(cPrime.multiply(eInverse)).mod(pPrime_qPrime);
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

Issuer.prototype.addHatAttrExpos = function(attrStructs, sValues, baseStruct, n, expoList) {
	for ( var i in attrStructs) {
		var attrStruct = attrStructs[i];
		if (attrStruct.getIssuanceMode() != IssuanceMode.KNOWN) {
			var name = attrStruct.getName();
			var mHat = sValues[name].getValue();
			var keyIndex = attrStruct.getPubKeyIndex();
			if(Constants.FAST_EXPO) {
				expoList.push(new Exponentiation(baseStruct["R_"+keyIndex], mHat, null));
			} else {
				expoList.push(new Exponentiation(baseStruct[keyIndex], mHat, n));
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

		if (!Utils.isInIntervalSymmetric(values[name].getValue(), bitLength)) {
			return false;
		}
	}
	return true;
};

Issuer.prototype.computeQ = function(capS, capU, capZ, baseStruct, vPrimePrime, n) {
	var expoList = new Array();
	var attrStructs = this.credStruct
			.getAttributeStructures(IssuanceMode.KNOWN);
	for ( var i=0; i<attrStructs.length; i++) {
		var attrStruct = attrStructs[i];
		if(Constants.FAST_EXPO) {
			expoList.push(new Exponentiation(baseStruct["R_"+attrStruct.getPubKeyIndex()],
				this.values.getValue(attrStruct), null));
			expoList.push(new Exponentiation(baseStruct["S"], vPrimePrime, null));
		} else {
			expoList.push(new Exponentiation(baseStruct[attrStruct.getPubKeyIndex()], this.values
					.getValue(attrStruct), n));
			expoList.push(new Exponentiation(capS, vPrimePrime, n));
		}
	}

	var capQ = Utils.multiExpMul(expoList, n);
	capQ = capQ.multiply(capU).mod(n);
	capQ = capQ.modInverse(n);
	capQ = capQ.multiply(capZ).mod(n);

	return capQ;
};


if(typeof exports != 'undefined')
	module.exports = Issuer;