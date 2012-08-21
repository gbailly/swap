CredentialStructure = function(attrStructs) {
	this.attrStructs = attrStructs;
};

CredentialStructure.prototype.getAttributeStructures = function(issuanceMode) {
	if (issuanceMode == null) {
		return this.attrStructs.slice(0);
	}
	else {
		var attrStructs = new Array();
		for (var i=0; i<this.attrStructs.length;i++) {
			var attrStruct = this.attrStructs[i];
			if (attrStruct.getIssuanceMode() == issuanceMode) {
				attrStructs.push(attrStruct);
			}
		}
	}
	return attrStructs;
};

CredentialStructure.prototype.getAttributeStructure = function(name) {
for (var i=0; i<this.attrStructs.length;i++) {
		var attrStruct = this.attrStructs[i];
		if (attrStruct.getName().toLowerCase() == name.toLowerCase()) {
			return attrStruct;
		}
	}
	return null;
};

CredentialStructure.prototype.createAttributes = function(values) {
	var attributes = new Array();
	for (var i=0; i<this.attrStructs.length;i++) {
		var attrStruct = this.attrStructs[i];
		attributes.push(attrStruct.createAttribute(values.get(attrStruct.getName())));
	}
	return attributes;
};


if(typeof exports != 'undefined')
	module.exports = CredentialStructure;