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

DomNym = function(groupParamsLocation, domNym, g_dom) {
	this.groupParamsLocation = groupParamsLocation;
	this.groupParams = StructureStore.getInstance().get(groupParamsLocation);
	this.domNym = domNym;
	this.g_dom = g_dom;
};

DomNym.prototype.getNym = function() {
	return this.domNym;
};

DomNym.prototype.getG_dom = function() {
	return this.g_dom;
};


if(typeof exports != 'undefined')
	module.exports = DomNym;