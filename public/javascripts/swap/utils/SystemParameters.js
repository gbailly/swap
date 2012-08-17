SystemParameters = function(l_n, l_Gamma, l_rho, l_m, l_res, l_e, l_ePrime, l_v, l_Phi, l_k, l_H, l_r, l_pt, l_enc) {
	/** Length of the modulus. */
    this.l_n = l_n;
    this.l_Gamma = l_Gamma;
    this.l_rho = l_rho;
		/** Length of messages in the CL signature. */
    this.l_m = l_m;
		/** Number of reserved attributes. */
    this.l_res = l_res;
		/** Length of CL-signature value <tt>e</tt>. */
    this.l_e = l_e;
		/** Length of value <tt>e'</tt>. */
    this.l_ePrime = l_ePrime;
		/** Length of CL-signature value <tt>v</tt>. */
    this.l_v = l_v;
		/** Length to attain statistical zero-konwledge. */
    this.l_Phi = l_Phi;
    this.l_k = l_k;
		/** Length of hash function used. */
    this.l_H = l_H;
    this.l_r = l_r;
		/** Prime probability. */
    this.l_pt = l_pt;
	
	// this.checkConstraints();
};

SystemParameters.prototype.getL_n = function() {
	return this.l_n;
};

SystemParameters.prototype.getL_Gamma = function() {
	return this.l_Gamma;
};

SystemParameters.prototype.getL_rho = function() {
	return this.l_rho;
};

SystemParameters.prototype.getL_m = function() {
	return this.l_m;
};

SystemParameters.prototype.getL_res = function() {
	return this.l_res;
};

SystemParameters.prototype.getL_e = function() {
	return this.l_e;
};

SystemParameters.prototype.getL_ePrime = function() {
	return this.l_ePrime;
};

SystemParameters.prototype.getL_v = function() {
	return this.l_v;
};

SystemParameters.prototype.getL_Phi = function() {
	return this.l_Phi;
};

SystemParameters.prototype.getL_k = function() {
	return this.l_k;
};

SystemParameters.prototype.getL_H = function() {
	return this.l_H;
};

SystemParameters.prototype.getL_r = function() {
	return this.l_r;
};

SystemParameters.prototype.getL_pt = function() {
	return this.l_pt;
};
/*
 private void checkConstraints() {
     if (l_e <= (l_Phi + l_H + Math.max(l_m + 4, l_prime_e + 2))) {
         throw new IllegalArgumentException("constraint 1");
     }
     if (l_v <= (l_n + l_Phi + l_H + Math.max(l_m + l_r + 3, l_Phi + 2))) {
         throw new IllegalArgumentException("constraint 2");
     }
     if (l_H < l_k) {
         throw new IllegalArgumentException("constraint 3");
     }
     if (l_H >= l_e) {
         throw new IllegalArgumentException("constraint 5");
     }
     if (l_prime_e >= l_e - l_Phi - l_H - 3) {
         throw new IllegalArgumentException("constraint 6");
     }
     if (l_rho > l_m) {
         throw new IllegalArgumentException("constraint 7");
     }
 }*/

if(typeof exports != 'undefined')
	module.exports = SystemParameters;