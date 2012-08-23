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