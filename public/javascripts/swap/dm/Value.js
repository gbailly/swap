Value = function(value, primeEncodedElements) {
	this.value = value;
	this.primeEncodedElements = primeEncodedElements;
};

Value.prototype.getContent = function() {
	return this.value;
};


if(typeof exports != 'undefined')
	module.exports = Value;