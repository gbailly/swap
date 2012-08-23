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