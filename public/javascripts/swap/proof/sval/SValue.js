SValue = function(value) {
	/** Content of the s-value. */
	this.value = value;
};

SValue.prototype.getValue = function() {
	return this.value;
};


if(typeof exports != 'undefined')
	module.exports = SValue;