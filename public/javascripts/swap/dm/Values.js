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