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