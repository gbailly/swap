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

IssuerPublicKey = function(groupParams, capS, capZ, capR, n) {
	/** Location of the group parameters corresponding to this key */
	this.groupParams = groupParams;
	/** BigInteger <tt>S</tt> as specified in ... */
	this.capS = capS;
	/** BigInteger <tt>Z</tt> as specified in ... */
	this.capZ = capZ;
	/** BigInteger array [<tt>R<sub>1</sub>, ... , R<sub>m</sub></tt>]. Bases for the messages. */
	this.capR = capR;
	/** BigInteger <tt>n</tt>. Modulus. */
	this.n = n;
};

IssuerPublicKey.prototype.getGroupParams = function() {
	return this.groupParams;
};

IssuerPublicKey.prototype.getCapS = function() {
	return this.capS;
};

IssuerPublicKey.prototype.getCapZ = function() {
	return this.capZ;
};

IssuerPublicKey.prototype.getCapR = function() {
	return this.capR;
};

IssuerPublicKey.prototype.getN = function() {
	return this.n;
};


if(typeof exports != 'undefined')
	module.exports = IssuerPublicKey;