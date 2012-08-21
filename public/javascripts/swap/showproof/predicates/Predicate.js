/**
 * Defines the different predicates.
 */
PredicateType = {
	/** Camenisch-Lysyanskaya Predicate (proof of knowledge). */
	CL : "CL",
	/** Inequality predicate. */
	INEQUALITY : "INEQUALITY",
	/** Prime encoding predicate. */
	ENUMERATION : "ENUMERATION"
};

Predicate = function(predicateType) {
	/** PredicateType of this predicate. */
	this.predicateType = predicateType;
};

Predicate.prototype.getPredicateType = function() {
	return this.predicateType;
};


if(typeof exports != 'undefined')
	module.exports = Predicate;