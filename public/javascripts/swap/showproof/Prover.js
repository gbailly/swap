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
 */

Prover = function(masterSecret, credentialMap, proofSpec, nonce1, commOpeningMap) {
	this.masterSecret = masterSecret;
	this.credentialMap = credentialMap;
	this.proofSpec = proofSpec;
	this.nonce1 = nonce1;
	this.commOpeningMap = commOpeningMap;

	if(proofSpec != null) {
		this.groupParams = proofSpec.getGroupParams();
		this.systemParams = this.groupParams.getSystemParams();
	}

	this.validate();
};

Prover.prototype.validate = function() {
	var predicateList = this.proofSpec.getPredicates();
	for ( var i in predicateList) {
		var predicate = predicateList[i];
		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			var name = predicate.getTempCredName();
			if (this.credentialMap == null || this.credentialMap[name] == null) {
				alert("Missing credential with temporary name " + name);
			}
			break;
		case PredicateType.INEQUALITY:
			// TODO implement verification if inequality holds?
			break;
		case PredicateType.ENUMERATION:
			break;
		default:
			alert("Wrong predicate type.");
		}
	}
};

Prover.prototype.appendCommonValue = function(name, c) {
	this.commonValueMap[name] = c;
};

Prover.prototype.setFixedBaseWindowingMap = function(fixedBaseWindowingMap) {
	this.fixedBaseWindowingMap = fixedBaseWindowingMap;
};

Prover.prototype.setNonce = function(nonce) {
	this.nonce1 = nonce;
};

Prover.prototype.getSystemParams = function() {
	return this.systemParams;
};

Prover.prototype.buildProof = function() {
	this.primeEncodingProverList = new Array();
	this.inequalityProverList = new Array();
	this.tValueList = new Array();
	this.commonValueMap = new Object();
	this.sValueMap = new Object();
	this.stateMap = new Object();
	
	// we have two rounds: in the first round we compute the t-values
	// (witnesses) then the Fiat-Shamir challenge. In the second round we
	// compute the s-values (responses) using that challenge.
	
	
	var bitLength = this.systemParams.getL_m()
		+ this.systemParams.getL_Phi() + this.systemParams.getL_H();
	
	// generate new randomness for the proof
	this.masterSecret.setMTilde_1(Utils.computeRandomNumberFromBitLength(bitLength));
	
	// [spec: buildProof 0.1]
	var identifierList = this.proofSpec.getIdentifiers();
	for ( var i=0; i<identifierList.length; i++) {
		var identifier = identifierList[i];
		if (!identifier.isRevealed()) {
			identifier.setRandom(Utils.computeRandomNumberFromBitLength(bitLength));
		}
	}

	// [spec: buildProof 1.] iterate over all predicates, call sub-provers
	var predicateList = this.proofSpec.getPredicates();
	for ( var i=0; i<predicateList.length; i++) {
		var predicate = predicateList[i];
		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			var credential = this.credentialMap[predicate.getTempCredName()];
			this.proveCL(credential, predicate, null);
			break;
		case PredicateType.ENUMERATION:
			this.provePrimeEncode(predicate);
			break;
		case PredicateType.INEQUALITY:
			//this.proveInequality(predicate);
			break;
		default:
			alert("Unimplemented predicate.");
		}
	}

	// [spec: buildProof 2.]
	var challenge = this.computeChallenge();

	// [spec: buildProof 3.] call sub-provers again, this time with the challenge
	for ( var i=0; i<predicateList.length; i++) {
		var predicate = predicateList[i];
		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			var credential = this.credentialMap[predicate.getTempCredName()];
			// TODO in case a secure device is used together with a
			// host, the challenge might be updated!
			this.proveCL(credential, predicate, challenge);
			break;
		// case Predicatetype.ENUMERATION:
		// // - enumerated values are handled further down.
		// break;
		// case Predicatetype.INEQUALITY:
		// // - inequalities are handled further down.
		// break;
		default:
			alert("Unimplemented predicate.");
		}
	}
	
	// Inequality Prover and Enumeration Prover keep state between the
	// computation of the t-values and the s-values. Thus, there is a
	// seperate object for each predicate storing the corresponding values.
	// Now we iterate through all those prover objects rather than
	// considering them in the previous switch statement.
/*
	// [spec: ProvePrimeEncoding 4.] add s-values for prime encodings
	for ( var i in this.primeEncodingProverList) {
		var sValueMap = this.primeEncodingProverList[i]
				.computeSValues(challenge);
		for ( var key in sValueMap)
			this.sValueMap[key] = sValueMap[key];
	}
	// [spec: ProveInequality 3.] add s-values for inequality provers
	for ( var i in this.inequalityProverList) {
		var sValueMap = this.inequalityProverList[i].computeSValues(challenge);
		for ( var key in sValueMap)
			this.sValueMap[key] = sValueMap[key];
	}*/

	// output proof
	return new Proof(challenge, this.sValueMap, this.commonValueMap);
};

Prover.prototype.proveCL = function(credential, predicate, challenge) {
	if(challenge == null) {
		if (credential.getCredStruct().toJSONString() != predicate.getCredStruct().toJSONString()) {
			alert("Credential structures of given credential and proof "
					+ "specification do not match for "
					+ predicate.getTempCredName());
		}
		var issuerPubKey = credential.getIssuerPubKey();
		var l_Phi = this.systemParams.getL_Phi();
		var l_H = this.systemParams.getL_H();
		var capS = issuerPubKey.getCapS();
		var n = issuerPubKey.getN();
		var capR = issuerPubKey.getCapR();

		// [spec: ProveCL 1.] randomize signature

		// [spec: ProveCL 1.1]
		var r_A = Utils.computeRandomNumberFromBitLength(this.systemParams.getL_n() + l_Phi);
		// [spec: ProveCL 1.2]
		var capAPrime = null;
		if(Constants.FAST_EXPO) {
			capAPrime = Utils.expMul(credential.getCapA(), this.fixedBaseWindowingMap["S"], r_A, n);
		} else {
			capAPrime = Utils.expMul(credential.getCapA(), capS, r_A, n);
		}
		var vPrime = credential.getV().subtract(credential.getE().multiply(r_A));
		var ePrime = credential.getE().subtract(
				BigInteger.ONE.shiftLeft(this.systemParams.getL_e() - 1));

		// [spec: ProveCL 2] compute t-values

		// [spec: ProveCL 2.1]
		var eTilde = Utils.computeRandomNumberSymmetric(this.systemParams
				.getL_ePrime() + l_Phi + l_H);
		var vTildePrime = Utils.computeRandomNumberSymmetric(this.systemParams
				.getL_v() + l_Phi + l_H);
		// save the state to compute the s-values later
		var state = new ProofState();
		state.put("eTilde", eTilde);
		state.put("ePrime", ePrime);
		state.put("vPrime", vPrime);
		state.put("vTildePrime", vTildePrime);
		this.stateMap[predicate.getTempCredName()] = state;
		// [spec: ProveCL 2.2] compute capZTilde
		var expoList = new Array();
		expoList.push(new Exponentiation(capAPrime, eTilde, n));
		if(Constants.FAST_EXPO) {
			expoList.push(new Exponentiation(this.fixedBaseWindowingMap["S"], vTildePrime, null));
		} else {
			expoList.push(new Exponentiation(capS, vTildePrime, n));
		}
		// TODO handle attributes in credential
		var attrList = credential.getAttributes();
		for ( var i=0; i<attrList.length; i++) {
			var attr = attrList[i];
			var attrName = attr.getName();
			var identifier = predicate.getIdentifier(attrName);
			identifier.setAttribute(attr);
			if (!identifier.isRevealed()) {
				// recovering the randomness for the identifiers computed in step 0 of buildProof
				var mTilde = identifier.getRandom();
				if(Constants.FAST_EXPO) {
					expoList.push(new Exponentiation(this.fixedBaseWindowingMap["R_"+attr.getPubKeyIndex()], mTilde, null));
				} else {
					expoList.push(new Exponentiation(capR[attr.getPubKeyIndex()], mTilde, n));
				}
			}
		}
		// recovering the randomness for the master secret computed in step 0 of buildProof
		if(Constants.FAST_EXPO) {
			expoList.push(new Exponentiation(this.fixedBaseWindowingMap["R_" + IssuanceSpec.MASTER_SECRET_INDEX],
				this.masterSecret.getMTilde_1(), null));
		} else {
			expoList.push(new Exponentiation(capR[IssuanceSpec.MASTER_SECRET_INDEX],
				this.masterSecret.getMTilde_1(), n));
		}
		var capZTilde = Utils.multiExpMul(expoList, n);

		// [spec: ProveCL 3.] output t-value capZTilde, common value capAPrime.
		this.tValueList.push(capZTilde);
		// note that we wrap the common value A' into a tagged common value.
		this.commonValueMap[predicate.getTempCredName()] = capAPrime;
		
	} else {
		var state = this.stateMap[predicate.getTempCredName()];

		// [spec: ProveCL 4.1]
		var eHat = Utils.computeResponse(state.get("eTilde"), challenge, state
				.get("ePrime"));
		// [spec: ProveCL 4.2]
		var vHatPrime = Utils.computeResponse(state.get("vTildePrime"), challenge,
				state.get("vPrime"));
		// [spec: ProveCL 4.3]
		// iterate over all the identifiers
		var identifierList = this.proofSpec.getIdentifiers();
		for ( var i=0; i<identifierList.length; i++) {
			var identifier = identifierList[i];
			var s;
			if (identifier.isRevealed()) {
				s = identifier.getValue();
			}
			else {
				s = Utils.computeResponse(identifier.getRandom(), challenge,
						identifier.getValue());
			}
			// note that identifier names must be unique
			this.sValueMap[identifier.getName()] = new SValue(s);
		}

		// add s-value for master secret
		var s_m = Utils.computeResponse(this.masterSecret.getMTilde_1(),
			challenge, this.masterSecret.getValue())
		this.sValueMap[IssuanceSpec.MASTER_SECRET_NAME] = new SValue(s_m);

		var sValues = new SValue(new SValuesProveCL(eHat, vHatPrime));
		this.sValueMap[predicate.getTempCredName()] = sValues;
	}
};

Prover.prototype.provePrimeEncode = function(predicate) {
	// use the issuer public key of the first certificate that certifies E
	var issuerPubKey = Utils.getPrimeEncodingConstants(predicate);
	var primeEncodeProver = new PrimeEncodeProver(predicate, this, issuerPubKey);
	this.primeEncodingProverList.push(primeEncodeProver);
	this.tValueList = this.tValueList
			.concat(primeEncodeProver.computeTValues());
};

Prover.prototype.proveInequality = function(predicate) {
	var inequalityProver = new InequalityProver(this, predicate);
	this.tValueList.concat(inequalityProver.computeTHatValues());
	this.inequalityProverList.push(inequalityProver);
};

Prover.prototype.computeChallenge = function() {
	// TODO define how the common list and messages should be ordered
	// (cf. Verifier.js)
	var commonValueList = new Array();
	for ( var key in this.commonValueMap) {
		commonValueList.push(this.commonValueMap[key]);
	}
	commonValueList = commonValueList.concat(this.tValueList);

	var challenge = Utils.computeChallenge(this.systemParams, this.proofSpec
			.getContext(), commonValueList, this.nonce1);

	return challenge;
};


function ProofState() {
	this.valueMap = new Object();
};

ProofState.prototype.put = function(name, value) {
	this.valueMap[name] = value;
};

ProofState.prototype.get = function(name) {
	var value = this.valueMap[name];
	if (!value)
		throw new Error("State does not contain the value " + name);
	return value;
};


if(typeof exports != 'undefined')
	exports = Prover;