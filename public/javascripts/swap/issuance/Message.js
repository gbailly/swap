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

/** Issuance protocol values enum */
IssuanceProtocolValues = {
    /** Common value <tt>U</tt>. */
    capU: "capU",
    /** Nonce. */
    nonce: "nonce",
    /** Signature value <tt>A</tt>. */
    capA: "capA",
    /** Signature value <tt>e</tt>. */
    e: "e",
    /** Signature value <tt>v''</tt>. */
    vPrimePrime: "vPrimePrime",
    /** Verification value for the signature. */
    capQ: "capQ"
};

Message = function(issuanceElements, proof, updateLocation) {
	/** Map with all the elements of the message. */
	this.issuanceProtocolValues = issuanceElements;
	/** Proof. */
	this.proof = proof;
	/** Location where the updates for a credential can be downloaded (not used) */
	this.updateLocation = updateLocation;
}

Message.prototype.getIssuanceElement = function(key) {
	return this.issuanceProtocolValues[key];
};

Message.prototype.getProof = function() {
	return this.proof;
};


if(typeof exports != 'undefined')
	module.exports = Message;