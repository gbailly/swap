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

GroupParameters = function(capGamma, rho, g, h, systemParams) {
		/** BigInteger <tt>capGamma</tt>. Commitment group order. */
    this.capGamma = capGamma;
		/** BigInteger <tt>rho</tt>. Order of the subgroup of the commitment group. */
    this.rho = rho;
		/** BigInteger <tt>g</tt>. Generator. */
    this.g = g;
		/** BigInteger <tt>h</tt>. Generator. */
    this.h = h;
		/** System parameters with respect to which the group parameters have been created. */
    this.systemParams = systemParams;
};

GroupParameters.prototype.getCapGamma = function() {
    return this.capGamma;
};

GroupParameters.prototype.getRho = function() {
    return this.rho;
};

GroupParameters.prototype.getG = function() {
    return this.g;
};

GroupParameters.prototype.getH = function() {
	return this.h;
};

GroupParameters.prototype.getSystemParams = function() {
    return this.systemParams;
};


if(typeof exports != 'undefined')
	module.exports = GroupParameters;