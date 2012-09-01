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

ASN1 = function() {
}


ASN1.SEQ = 0x30;
ASN1.INT = 0x02;


ASN1.encode = function(array) {
	asn = new Array();
	
	for (var i=0; i<array.length; i++) {
		var asnf = array[i].toByteArray();
		asn = asn.concat(ASN1.INT);
		ASN1.lenwrite(asn, asnf.length);
		asn = asn.concat(asnf);
	}
	
	// Add number of values
	asn = [ASN1.INT, 1, array.length].concat(asn);
	
	// Add sequence prefix
	ASN1.lenwrite(asn, asn.length);
	asn = [ASN1.SEQ].concat(asn);
	
	return asn;
};

// DER length bytes
ASN1.lenwrite = function(asn, len) {
	if (len <= 0x7F)
		asn = [len].concat(asn);
	else {
		var i = 0x80;
		while (len > 0) {
			asn = [len & 0xFF].concat(asn);
			len >>= 8;
			i++;
		}
		asn = [i & 0xFF].concat(asn);
	}
};


if(typeof exports != 'undefined')
	module.exports = ASN1;