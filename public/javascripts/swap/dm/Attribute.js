Attribute = function(attrStruct, value, primeFactors) {
	this.attrStruct = attrStruct;
	this.value = value;
	this.primeFactors = primeFactors;
};

Attribute.prototype.getPubKeyIndex = function() {
	return this.attrStruct.getPubKeyIndex();
};

Attribute.prototype.getName = function() {
	return this.attrStruct.getName();
};

Attribute.prototype.getIssuanceMode = function() {
	return this.attrStruct.getIssuanceMode();
};

Attribute.prototype.getValue = function() {
	if (this.attrStruct.getIssuanceMode() == IssuanceMode.COMMITTED) {
		if (this.value instanceof CommitmentOpening)
			return this.value.getMessageValue();
		else
			alert("Message of committed value cannot be retrieved.");
	} else
		return this.value;
};

Attribute.prototype.getValueObject = function() {
	return this.value;
};

Attribute.prototype.getPrimeFactors = function() {
	return this.primeFactors;
};


if(typeof exports != 'undefined')
	module.exports = Attribute;