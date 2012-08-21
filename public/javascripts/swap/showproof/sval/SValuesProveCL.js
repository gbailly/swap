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