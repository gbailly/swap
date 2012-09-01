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

/** Data types for attributes. */
DataType = {
	/** Integer attributes. */
	INT : "INT",
	/** String attributes. */
	STRING : "STRING",
	/** Enumerated attributes. */
	ENUM : "ENUM"
};

/** Issuance mode of attributes. */
IssuanceMode = {
	/** Attribute is known to the issuer (and the recipient). */
	KNOWN : "KNOWN",
	/** The recipient committed to the attribute. */
	COMMITTED : "COMMITED",
	/** Attribute is hidden towards the issuer. */
	HIDDEN : "HIDDEN"
};

AttributeStructure = function(name, pubKeyIndex, issuanceMode, attributeType) {
	/** Attribute's name. */
	this.name = name;
	// Position at which this attribute appears within the credential. This
	// corresponds to the indexes the attribute has with respect to the bases of
	// the issuer public key.
	this.pubKeyIndex = pubKeyIndex;
	/** The issuance mode of this attribute. */
	this.issuanceMode = issuanceMode;
	/** Data type of the attribute (e.g., INT, STR, DATE). */
	this.dataType = attributeType;
};

AttributeStructure.prototype.getName = function() {
	return this.name;
};

AttributeStructure.prototype.getPubKeyIndex = function() {
	return this.pubKeyIndex;
};

AttributeStructure.prototype.getIssuanceMode = function() {
	return this.issuanceMode;
};

AttributeStructure.prototype.getDataType = function() {
	return this.dataType;
};

AttributeStructure.prototype.createAttribute = function(value) {
	var primeFactors = (this.dataType == DataType.ENUM ? value
			.getPrimeEncodedElements() : null);
	return new Attribute(this, value.getContent(), primeFactors);
};

AttributeStructure.prototype.setPrimeEncodedFactors = function(
		primeEncodedFactors, numValues) {
	if (this.primeFactors != null) {
		alert("Prime encoding is already instantiated.");
	}
	// Object containing all possible attributes and their corresponding prime values.
	this.primeFactors = primeEncodedFactors;
	/** Number of primes encoded into one attribute. */
	this.t = numValues;
};


if(typeof exports != 'undefined')
	module.exports = AttributeStructure;