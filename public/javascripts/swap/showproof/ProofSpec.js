ProofSpec = function(identifierMap, predicateList) {
	this.identifierMap = identifierMap;
	this.predicateList = predicateList;

	this.validate();
};

ProofSpec.prototype.validate = function() {
	for ( var i=0; i< this.predicateList.length; i++) {
		var predicate = this.predicateList[i];

		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			var credStruct = predicate.getCredStruct();
			
			var attrStructList = credStruct.getAttributeStructures();
			for ( var j=0; j < attrStructList.length; j++) {
				var attrStruct = attrStructList[j];
				var attrName = attrStruct.getName();
				var identifier = predicate.getIdentifier(attrName);
				// verify that attributes have a corresponding identifier
				if (identifier == null) {
					alert("No identifier for attribute " + attrName + " declared.");
				}
				// verify that data type of attribute and identifier match
				if (identifier.getDataType() != attrStruct.getDataType()) {
					alert("Wrong data type: " + attrName + " <> " + identifier.getName());
				}
			}
			this.groupParams = predicate.getIssuerPubKey().getGroupParams();
			break;
		default:
		}
	}
};

ProofSpec.prototype.getGroupParams = function() {
	return this.groupParams;
};

ProofSpec.prototype.getPredicates = function() {
	return this.predicateList;
};

ProofSpec.prototype.getIdentifiers = function() {
	var identifierList = new Array();
	for ( var key in this.identifierMap)
		identifierList.push(this.identifierMap[key]);
	return identifierList;
};

ProofSpec.prototype.getCredTempNames = function() {
	var credTempNameList = new Array();
	for ( var i in this.predicateList) {
		var predicate = this.predicateList[i];

		switch (predicate.getPredicateType()) {
		case PredicateType.CL:
			credTempNameList.push(predicate.getTempCredName());
		}
	}
	return credTempNameList;
};

ProofSpec.prototype.getContext = function() {
	var contextList = new Array();

	// add values of group parameters
	Utils.computeGroupParamsContext(this.groupParams, contextList);

	// add values of all issuer public keys (possibly multiple times)
	for ( var i in this.predicateList) {
		var predicate = this.predicateList[i];
		if (predicate instanceof CLPredicate) {
			Utils.computeKeyContext(predicate.getIssuerPubKey(), contextList);
		}
	}

	return Utils.hashOf1(this.groupParams.getSystemParams().getL_H(), contextList);
};


if(typeof exports != 'undefined')
	module.exports = ProofSpec