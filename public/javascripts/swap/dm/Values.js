Values = function(systemParameters) {
	/** System parameters (used for the length of the hash). */
	this.systemParams = systemParameters;
	/** List of all the values used during issuance. */
	this.values = new Object();
};

Values.prototype.add = function(name, value) {
	var encodedValue = value;
	this.values[name] = new Value(encodedValue, null);
};

Values.prototype.get = function(name) {
	return this.values[name];
};

Values.prototype.getValue = function(attrStruct) {
	var value = this.values[attrStruct.getName()];
	if(attrStruct.getIssuanceMode() != IssuanceMode.COMMITTED) {
		return value.getContent();
	}	else {
		return value.getContent().getMessageValue();
	}
};

Values.prototype.setValues = function(valueMap) {
	this.values = valueMap;
};


if(typeof exports != 'undefined')
	module.exports = Values;