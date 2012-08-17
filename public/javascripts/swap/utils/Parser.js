Parser = function() {
  this.identifierToAttributeMap = new Object();
}

/**
 * @return Singleton instance of this class.
 */
Parser.getInstance = function() {
  if (Parser.parser == null)
    Parser.parser = new Parser();
  /** Singleton design pattern. */
  return Parser.parser;
};

Parser.prototype.parse = function(xmlDoc) {
  if (xmlDoc.documentElement.nodeName == "Credential")
    return this.parseCredential(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "CredentialStructure")
    return this.parseCredentialStructure(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "FixedBaseWindowings")
    return this.parseFixedBaseWindowings(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "GroupParameters")
    return this.parseGroupParams(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "IssuerPrivateKey")
    return this.parseIssuerPrivateKey(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "IssuerPublicKey")
    return this.parseIssuerPublicKey(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "MasterSecret")
    return this.parseMasterSecret(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "ProofSpecification")
    return this.parseProofSpec(xmlDoc);
  if (xmlDoc.documentElement.nodeName == "SystemParameters")
    return this.parseSystemParams(xmlDoc);
  return null;
};

Parser.prototype.getValue = function(root, element, index) {
  var value = null;
  if (root == null && index == null)
    value = element;
  else if (index == null)
    value = root.getElementsByTagName(element).item(0);
  else if (element == null)
    value = root[index];
  return this.normalize(value.childNodes.item(0).nodeValue);
};

Parser.prototype.normalize = function(string) {
  return string.replace(/\n/g, "").replace(/\t/g, "");
};

Parser.prototype.parseGroupParams = function(xmlDoc) {
	// references
  var references = xmlDoc.getElementsByTagName("References").item(0);
  var systemParamsLocation = this.getValue(references, "SystemParameters");
	var systemParams = StructureStore.getInstance().get(systemParamsLocation, null);
	
	// elements
  var elements = xmlDoc.getElementsByTagName("Elements").item(0);
  var capGamma = new BigInteger(this.getValue(elements, "Gamma", null));
  var g = new BigInteger(this.getValue(elements, "g", null));
  var h = new BigInteger(this.getValue(elements, "h", null));
  var rho = new BigInteger(this.getValue(elements, "rho", null));

  return new GroupParameters(capGamma, rho, g, h, systemParams);
};

Parser.prototype.parseSystemParams = function(xmlDoc) {
  var elements = xmlDoc.getElementsByTagName("Elements")[0];
  var l_e = parseInt(this.getValue(elements, "l_e", null));
  var l_e_prime = parseInt(this.getValue(elements, "l_ePrime", null));
  var l_Gamma = parseInt(this.getValue(elements, "l_Gamma", null));
  var l_H = parseInt(this.getValue(elements, "l_H", null));
  var l_k = parseInt(this.getValue(elements, "l_k", null));
  var l_m = parseInt(this.getValue(elements, "l_m", null));
  var l_n = parseInt(this.getValue(elements, "l_n", null));
  var l_Phi = parseInt(this.getValue(elements, "l_Phi", null));
  var l_pt = parseInt(this.getValue(elements, "l_pt", null));
  var l_r = parseInt(this.getValue(elements, "l_r", null));
  var l_res = parseInt(this.getValue(elements, "l_res", null));
  var l_rho = parseInt(this.getValue(elements, "l_rho", null));
  var l_v = parseInt(this.getValue(elements, "l_v", null));

  return new SystemParameters(l_n, l_Gamma, l_rho, l_m, l_res, l_e,
    l_e_prime, l_v, l_Phi, l_k, l_H, l_r, l_pt);
};

if(typeof exports != 'undefined')
  module.exports = Parser;