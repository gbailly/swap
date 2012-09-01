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

Credential = function(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct, capA, e, v, values,
		masterSecret, attributeList) {
	this.issuerPubKeyLocation = issuerPubKeyLocation;
	this.credStructLocation = credStructLocation;
	this.issuerPubKey = issuerPubKey;
	this.credStruct = credStruct;
	
	// Signature
	this.capA = capA;
	this.e = e;
	this.v = v;

	this.masterSecret = masterSecret;
	this.attributeList = attributeList;
	
	if (attributeList == null && values != null) {
		// create attributes using the given information
		this.attributeList = this.credStruct.createAttributes(values);
	}
};

Credential.prototype.getIssuerPubKeyLocation = function() {
	return this.issuerPubKeyLocation;
};

Credential.prototype.getCredStructLocation = function() {
	return this.credStructLocation;
};

Credential.prototype.getIssuerPubKey = function() {
	return this.issuerPubKey;
};

Credential.prototype.getCredStruct = function() {
	return this.credStruct;
};

Credential.prototype.getCapA = function() {
	return this.capA;
};

Credential.prototype.getE = function() {
	return this.e;
};

Credential.prototype.getV = function() {
	return this.v;
};

Credential.prototype.getMasterSecret = function() {
	return this.masterSecret;
};

Credential.prototype.getAttributes = function() {
	return this.attributeList;
};


if(typeof exports != 'undefined')
	module.exports = Credential;