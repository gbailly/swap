/*
 * Copyright 2012 Guillaume Bailly
 * 
 * This file is part of SW@P.
 * 
 * SW@P is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * SW@P is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with SW@P.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

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