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
 */

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