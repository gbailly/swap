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


if(typeof exports != 'undefined')
	exports = Recipient;