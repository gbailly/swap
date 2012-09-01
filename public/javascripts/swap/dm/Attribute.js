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