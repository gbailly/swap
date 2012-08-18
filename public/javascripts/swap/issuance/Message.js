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