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

// object = base or FixedBaseWindowing
Exponentiation = function(object, exponent, modulus) {
	this.base = null;
	this.exponent = exponent;
	this.modulus = null;
	this.fixedBaseWindowing = null;
	if(modulus != null) {
		this.base = object;
		this.modulus = modulus;
	}
	else {
		this.fixedBaseWindowing = object;
	}
};

Exponentiation.prototype.getBase = function() {
	return this.base;
};

Exponentiation.prototype.getExponent = function() {
	return this.exponent;
};

Exponentiation.prototype.getModulus = function() {
	return this.modulus;
};

Exponentiation.prototype.getFixedBaseWindowing = function() {
	return this.fixedBaseWindowing;
};


if(typeof exports != 'undefined')
	module.exports = Exponentiation;