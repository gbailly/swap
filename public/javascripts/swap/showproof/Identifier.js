/** All possible types of identifiers. */
ProofMode = {
	/** Attributes that are hidden from the verifier. */
	UNREVEALED : "UNREVEALED",
	/** Attributes that are revealed to the verifier. */
	REVEALED : "REVEALED"
};

Identifier = function(name, proofMode, dataType) {
	this.name = name;
	this.proofMode = proofMode;
	this.dataType = dataType;
};

Identifier.prototype.getName = function() {
	return this.name;
};

Identifier.prototype.getDataType = function() {
	return this.dataType;
};

Identifier.prototype.getRandom = function() {
	return this.random;
};

Identifier.prototype.setRandom = function(random) {
	this.random = random;
};

Identifier.prototype.setAttribute = function(attribute) {
	this.attribute = attribute;
};

Identifier.prototype.getValue = function() {
	return (this.attribute != null ? this.attribute.getValue() : this.value);
};

Identifier.prototype.getIssuerPubKeyId = function() {
	return this.issuerPubKeyId;
};

Identifier.prototype.getAttrStruct = function() {
	if (this.attr) {
		return this.attribute.getStruct();
	}
	else {
		var credStruct = StructureStore.getInstance().get(this.credStructId);
		return credStruct.getAttrStruct(this.attrName);
	}
};

Identifier.prototype.isRevealed = function() {
	return this.proofMode == ProofMode.REVEALED;
};


if(typeof exports != 'undefined')
	module.exports = Identifier;