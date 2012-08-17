GroupParameters = function(capGamma, rho, g, h, systemParams) {
		/** BigInteger <tt>capGamma</tt>. Commitment group order. */
    this.capGamma = capGamma;
		/** BigInteger <tt>rho</tt>. Order of the subgroup of the commitment group. */
    this.rho = rho;
		/** BigInteger <tt>g</tt>. Generator. */
    this.g = g;
		/** BigInteger <tt>h</tt>. Generator. */
    this.h = h;
		/** System parameters with respect to which the group parameters have been created. */
    this.systemParams = systemParams;
};

GroupParameters.prototype.getCapGamma = function() {
    return this.capGamma;
};

GroupParameters.prototype.getRho = function() {
    return this.rho;
};

GroupParameters.prototype.getG = function() {
    return this.g;
};

GroupParameters.prototype.getH = function() {
	return this.h;
};

GroupParameters.prototype.getSystemParams = function() {
    return this.systemParams;
};

if(typeof exports != 'undefined')
	module.exports = GroupParameters;