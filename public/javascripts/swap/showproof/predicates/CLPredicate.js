CLPredicate = function(issuerPubKey, credStruct, credName, attrToIdsMap) {
	/* predicate type */
	this.predicateInfo = Predicate;
	this.predicateInfo(PredicateType.CL); // super(PredicateType.CL)
	
	this.issuerPubKey = issuerPubKey;
	this.credStruct = credStruct;
	this.credName = credName;
	this.attrToIdsMap = attrToIdsMap;
};

CLPredicate.prototype = new Predicate();
CLPredicate.prototype.constructor = CLPredicate;


CLPredicate.prototype.getIssuerPubKey = function() {
	return this.issuerPubKey;
};

CLPredicate.prototype.getCredStruct = function() {
	return this.credStruct;
};

CLPredicate.prototype.getIdentifier = function(attrName) {
	return this.attrToIdsMap[attrName];
};

CLPredicate.prototype.getTempCredName = function() {
	return this.credName;
};


if(typeof exports != 'undefined')
	module.exports = CLPredicate;