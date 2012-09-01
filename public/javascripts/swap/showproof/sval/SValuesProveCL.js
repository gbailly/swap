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

SValuesProveCL = function(eHat, vHatPrime) {
	this.eHat = eHat;
	this.vHatPrime = vHatPrime;
};

SValuesProveCL.prototype.getEHat = function() {
  return this.eHat;
};

SValuesProveCL.prototype.getVHatPrime = function() {
  return this.vHatPrime;
};


if(typeof exports != 'undefined')
	module.exports = SValuesProveCL;