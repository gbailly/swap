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

IssuanceSpec = function(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct) {
	this.issuerPubKeyLocation = issuerPubKeyLocation;
	this.credStructLocation = credStructLocation;
	this.issuerPubKey = issuerPubKey;
	this.credStruct = credStruct;
};

/** Index of the public key base where the master secret is signed. */
IssuanceSpec.MASTER_SECRET_INDEX = 0;
/** Name of the master secret attribute. */
IssuanceSpec.MASTER_SECRET_NAME = "master_secret";

/** Name of the s-value to be used when stored to the additional values map. */
IssuanceSpec.s_e = "s_e";
IssuanceSpec.vHatPrime = "vHatPrime";
IssuanceSpec.rHat = "rHat";


IssuanceSpec.prototype.getIssuerPubKeyLocation = function() {
	return this.issuerPubKeyLocation;
};

IssuanceSpec.prototype.getCredStructLocation = function() {
	return this.credStructLocation;
};

IssuanceSpec.prototype.getPublicKey = function() {
	return this.issuerPubKey;
};

IssuanceSpec.prototype.getCredentialStructure = function() {
	return this.credStruct;
};

IssuanceSpec.prototype.getContext = function() {
	if (this.context == null)
		this.context = Utils.computeContext(this.issuerPubKey);
	return this.context;
};

IssuanceSpec.prototype.setContext =  function(context) {
	this.context = context;
};


if(typeof exports != 'undefined')
	module.exports = IssuanceSpec;