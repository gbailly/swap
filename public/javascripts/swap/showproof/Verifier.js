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

Verifier = function(proofSpec, proof, nonce1, commitmentMap) {
  this.proofSpec = proofSpec;
  if(proofSpec != null) {
    this.groupParams = proofSpec.getGroupParams();
    this.systemParams = this.groupParams.getSystemParams();
    this.nonce1 = nonce1;
    if(nonce1 == null) {
      this.nonce1 = Utils.computeRandomNumberSymmetric(this.systemParams.getL_m());
		}
  }

  this.proof = proof;
  this.commitmentMap = commitmentMap;
  this.tHatList = new Array();
  this.revealedValueMap = new Object();

	this.validate();
};

Verifier.prototype.validate = function() {
	var predicateList = this.proofSpec.getPredicates();
	for ( var i in predicateList) {
		var predicate = predicateList[i];
		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			// TODO verify that all credential structures are available
			break;
		case PredicateType.INEQUALITY:
			// TODO verify that inequality holds?
			break;
		case PredicateType.ENUMERATION:
			break;
		default:
			alert("Wrong predicate type.");
		}
	}
};

Verifier.prototype.setFixedBaseWindowingMap = function(fixedBaseWindowingMap) {
	this.fixedBaseWindowingMap = fixedBaseWindowingMap;
};

Verifier.prototype.getNonce = function() {
  return this.nonce1;
};

Verifier.prototype.setProof = function(proof) {
  this.proof = proof;
};

Verifier.prototype.verify = function() {
  var success = true;

  // compute -c, used in sub-verifications.
  this.negC = this.proof.getChallenge().negate();

  // Iterate over predicates, calling corresponding sub-verifiers
  var predicateList = this.proofSpec.getPredicates();
  for ( var i=0; i<predicateList.length; i++) {
    var predicate = predicateList[i];
    switch (predicate.getPredicateType()) {
      case PredicateType.CL:
        credStruct = predicate.getCredStruct();
        success = success && this.verifyCL(credStruct, predicate);
        break;
      case PredicateType.ENUMERATION:
        this.tHatList.addAll(this.verifyPrimeEncode(predicate));
        break;
      case PredicateType.INEQUALITY:
        //this.verifyInequality(predicate);
        break;
      default:
        alert("Unimplemented predicate.");
    }
  }/*
	console.log("c:" + this.proof.getChallenge());
	console.log("cHat:" + this.computeChallengeHat());*/
  // [spec: verifyProof 2.] Compute the challenge
  this.challengeHat = this.computeChallengeHat();

  // [spec: verifyProof 3.]
  //if (!this.challengeHat.equals(this.proof.getChallenge()))
  //  return false;

  return success;
};

Verifier.prototype.verifyCL = function(credStruct, predicate) {
  var clSVal = this.proof.getSValue(predicate.getTempCredName());

  var issuerPubKey = predicate.getIssuerPubKey();
  var n = issuerPubKey.getN();
  var capR = issuerPubKey.getCapR();

  // get the blinded signature
  var capAPrime = this.proof.getCommonValue(predicate.getTempCredName());

  var sValuesProveCL = clSVal.getValue();
  var eHat = sValuesProveCL.getEHat();
  var vHatPrime = sValuesProveCL.getVHatPrime();

  // [spec: VerifyCL 1.]
  
  // check length of eHat
  var bitLength = this.systemParams.getL_ePrime() + this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
  if (!Utils.isInIntervalSymmetric(eHat, bitLength)) {
		console.log("[Verifier:verifyCL()] Proof of Knowledge of the CL signature failed.")
    return false;
  }
  // Iterate over the identifiers: if it's a hidden value,  get the s-value,
  // if it's revealed, get the value: prepare the products for unrevealed
  // identifiers we need to compute tHat
  
  var productRevealedExpoList = new Array();
  var productNotRevealedExpoList = new Array();

  // setup the bounds for length checks on s-values
  bitLength = this.systemParams.getL_m()
  	+ this.systemParams.getL_Phi() + this.systemParams.getL_H() + 1;
    
  var attrStructList = credStruct.getAttributeStructures();
  for ( var i=0; i<attrStructList.length;i++) {
    var keyIndex;
    var attrStruct = attrStructList[i];
    var id = predicate.getIdentifier(attrStruct.getName());

    var sValue = this.proof.getSValue(id.getName()).getValue();
    keyIndex = attrStruct.getPubKeyIndex();

    if (!id.isRevealed()) {
      // add it to the unrevealed product
			if(Constants.FAST_EXPO) {
				productNotRevealedExpoList.push(new Exponentiation(
					this.fixedBaseWindowingMap["R_" + keyIndex], sValue, null));
			} else {
				productNotRevealedExpoList.push(new Exponentiation(capR[keyIndex], sValue, n));
			}
			
      // [spec: VerifyCL 2.]
      if (!Utils.isInIntervalSymmetric(sValue, bitLength)) {
				console.log("[Verifier:verifyCL()] Length check failed.");
        return false;
			}
    } else {
      // add revealed value to list
      this.revealedValueMap[predicate.getTempCredName()
      	+ Constants.DELIMITER + attrStruct.getName()] = sValue;

      // add it to the revealed product
			if(Constants.FAST_EXPO) {
				productRevealedExpoList.push(new Exponentiation(
					this.fixedBaseWindowingMap["R_" + keyIndex], sValue, null));
			} else {
				productRevealedExpoList.push(new Exponentiation(capR[keyIndex], sValue, n));
			}
    }
  }
  
  // [spec: VerifyCL 2.] Compute tHat

  // compute divisor
  var divisor = Utils.multiExpMul(productRevealedExpoList, n);
  divisor = Utils.expMul(divisor, capAPrime, BigInteger.ONE
    .shiftLeft(this.systemParams.getL_e() - 1), n);
  divisor = divisor.modInverse(n);

  // compute first part
  var tHat = issuerPubKey.getCapZ();
	tHat = tHat.multiply(divisor).mod(n);
  tHat = Utils.modPow(tHat, this.negC, n);

  // compute second part (unrevealed identifiers were considered above)
  productNotRevealedExpoList.push(new Exponentiation(capAPrime, eHat, n));
  var sMasterSecret = this.proof.getSValue(IssuanceSpec.MASTER_SECRET_NAME).getValue();
	if(Constants.FAST_EXPO) {
		productNotRevealedExpoList.push(new Exponentiation(
	    this.fixedBaseWindowingMap["R_" + IssuanceSpec.MASTER_SECRET_INDEX], sMasterSecret, null));
	  productNotRevealedExpoList.push(new Exponentiation(
			this.fixedBaseWindowingMap["S"], vHatPrime, null));
	} else {
		productNotRevealedExpoList.push(new Exponentiation(
	    capR[IssuanceSpec.MASTER_SECRET_INDEX], sMasterSecret, n));
	  productNotRevealedExpoList.push(new Exponentiation(issuerPubKey.getCapS(), vHatPrime, n));
	}
  var rightPart = Utils.multiExpMul(productNotRevealedExpoList, n);
	tHat = tHat.multiply(rightPart).mod(n);

  // [spec: VerifyCL 3.]
  this.tHatList.push(tHat);

  return true;
};

Verifier.prototype.computeChallengeHat = function() {
  // TODO define how the common list and messages should be ordered
  // (cf. Prover.js)
  var commonValueList = new Array();
  for ( var key in this.proof.getCommonValueMap()) {
    commonValueList.push(this.proof.getCommonValueMap()[key]);
	}
  commonValueList = commonValueList.concat(this.tHatList);
  
  var challenge = Utils.computeChallenge(this.systemParams,
    this.proofSpec.getContext(), commonValueList, this.nonce1);
            
  return challenge;
};


if(typeof exports != 'undefined')
  module.exports = Verifier;