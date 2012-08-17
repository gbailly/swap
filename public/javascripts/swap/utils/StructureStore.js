StructureStore = function() {
	this.structures = new Object();
}

StructureStore.getInstance = function() {
	if (StructureStore.structureStore == null)
		StructureStore.structureStore = new StructureStore();
	return StructureStore.structureStore;
};

StructureStore.prototype.get = function(objectLocation, objectXMLDoc) {
	var obj = this.structures[objectLocation];
	if (obj == null && objectXMLDoc != null) {
		obj = this.load(objectXMLDoc);
		if (obj != null) {
			this.structures[objectLocation] = obj;
		}
	}
	return obj;
};

StructureStore.prototype.load = function(objectXMLDoc) {
	return Parser.getInstance().parse(objectXMLDoc);
};

if(typeof exports != 'undefined')
	module.exports = StructureStore;