Nym = function(groupParams, m, name) {
  /** Group parameters. */
  this.groupParams = groupParams;
	/** random exponent */
  this.random = null;
  this.nym = null;
  if (m != null) {
    /** Randomness of nym <tt>r</tt>. */
    this.random = Utils.computeRandomNumber(BigInteger.ONE, groupParams.getRho(), groupParams.getSystemParams());
    /** Value of the nym: <tt>g^m1 * h^r</tt>. */
    this.nym = Commitment.computeCommitment(groupParams, m, this.random);
  }
  /** Name of this nym. */
  this.name = name;
};