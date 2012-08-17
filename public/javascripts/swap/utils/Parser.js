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

Parser.prototype.parseCredentialStructure = function(xmlDoc) {
  // TODO there should be a reference to the issuer public key
  // in the credential! Then, this reference can be removed.
  // Parse attributes
  var attributes = xmlDoc.getElementsByTagName("Attributes")[0];
  // Parse implementation specifics
  var implementation = xmlDoc.getElementsByTagName("Implementation")[0];
  var attrStructs = this.parseAttributes(attributes, implementation);
  return new CredentialStructure(attrStructs, null);
};

Parser.prototype.parseAttributes = function(attributes, implementation) {
  var attributesList = attributes.getElementsByTagName("Attribute");
  var attributesOrderList = (implementation
    .getElementsByTagName("AttributeOrder")[0])
  .getElementsByTagName("Attribute");
  var primeEncodingsList = implementation
  .getElementsByTagName("PrimeEncoding");

  var names = new Array();
  var issuanceModes = new Array();
  var dataTypes = new Array();
  var pubKeyIndexes = new Array();

  var nameObject = new Object();
  var primeFactorsObject = new Object();
  var finalObject = new Object();

  // Parsing Attributes
  for ( var i = 0; i < attributesList.length; i++) {
    var attribute = attributesList.item(i);
    var attributeAttr = attribute.attributes;
    var attributeName = attributeAttr.getNamedItem("name").value;
    var attributeDataType = attributeAttr.getNamedItem("type").value.toUpperCase();
    // scanning enumerated attributes
    if (attributeDataType == "ENUM") {
      var attributeTypeValues = attribute.getElementsByTagName("EnumValue");
      for ( var j = 0; j < attributeTypeValues.length; j++) {
        var attributeTypeValue = attributeTypeValues[j].childNodes[0].nodeValue;
        var key = attributeName + Constants.DELIMITER + attributeTypeValue;
        primeFactorsObject[key] = new PrimeEncodingFactor(attributeName, attributeTypeValue);
      }
    } else {
      dataTypes[i] = DataType[attributeDataType];
		}
    names[i] = attributeName;
    issuanceModes[i] = IssuanceMode[attributeAttr.getNamedItem("issuanceMode").value.toUpperCase()];
    nameObject[names[i]] = i;
  }

  // Parsing PrimeEncodings
  var numValues = new Array();
  for ( var i = 0; i < primeEncodingsList.length; i++) {
    var tempObject = new Object();
    var attributeNames = new Array();

    var primeFactors = primeEncodingsList.item(i).getElementsByTagName("PrimeFactor");
    for ( var j = 0; j < primeFactors.length; j++) {
      var primeFactor = primeFactors.item(j);
      var primeFactorAttributes = primeFactor.attributes;
      var attributeName = primeFactorAttributes.getNamedItem("attName").value;
      var attributeValue = primeFactorAttributes.getNamedItem("attValue").value;
      var prime = new BigInteger(this.normalize(primeFactor.childNodes.item(0).nodeValue));
      var key = attributeName + Constants.DELIMITER + attributeValue;
      var primeEncodingFactor = primeFactorsObject[key];
      primeEncodingFactor.setPrimeFactor(prime);
      tempObject[key] = primeEncodingFactor;
      // check if this attribute is already in the list of attributes
      if (attributeNames.indexOf(attributeName) < 0) {
        attributeNames.push(attributeName);
			}
    }

    // Matching attributes to PrimeEncodings
    var primeEncodingIssuanceMode = null;
    var attributeName = attributeNames.pop();
    while (attributeName != null) {
      var primeEncodingAttributes = primeEncodingsList.item(i).attributes;
      var index = nameObject[attributeName];
      if (primeEncodingIssuanceMode == null) {
        primeEncodingIssuanceMode = issuanceModes[index];
        var primeEncodingName = primeEncodingAttributes.getNamedItem("name").value;
        numValues[index] = primeEncodingAttributes.getNamedItem("numValues").value;
        if (Object.keys(tempObject).length > numValues[index])
          ;// EXCEPTION
        nameObject[primeEncodingName] = index;
        names[index] = primeEncodingName;
        dataTypes[index] = DataType["ENUM"];
        finalObject[primeEncodingName] = tempObject;
      } else {
        if (primeEncodingIssuanceMode != issuanceModes[index])
          ;// EXCEPTION
        // optional: removal of values...
        names[index] = "";
        issuanceModes[index] = null;
      }
      delete nameObject[attributeName];
      attributeName = attributeNames.pop();
    }
  }

  // Parsing AttributeOrder
  for ( var i = 0; i < attributesOrderList.length; i++) {
    var attributeOrder = attributesOrderList.item(i);
    var nameOrder = attributeOrder.attributes.getNamedItem("name").value;
    var j = nameObject[nameOrder];
    pubKeyIndexes[j] = parseInt(attributeOrder.childNodes.item(0).nodeValue);
  }

  // Creating attributes
  var attributeStructures = new Array();
  for ( var i = 0; i < names.length; i++) {
    if (names[i] == "")
      continue;
    var attributeStructure = new AttributeStructure(names[i], pubKeyIndexes[i], issuanceModes[i], dataTypes[i]);
    // setting object of prime encoded values
    attributeStructure.setPrimeEncodedFactors(finalObject[names[i]], numValues[i]);
    attributeStructures.push(attributeStructure);
  }

  return attributeStructures;
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

Parser.prototype.parseIssuerPrivateKey = function(xmlDoc) {
	// references
  var references = xmlDoc.getElementsByTagName("References").item(0);
  var issuerPubKeyLocation = this.getValue(references, "IssuerPublicKey", null);
	var issuerPubKey = StructureStore.getInstance().get(issuerPubKeyLocation, null);

	// elements
  var elements = xmlDoc.getElementsByTagName("Elements").item(0);
  var n = new BigInteger(this.getValue(elements, "n", null));
  var p = new BigInteger(this.getValue(elements, "p", null));
  var pPrime = new BigInteger(this.getValue(elements, "pPrime", null));
  var q = new BigInteger(this.getValue(elements, "q", null));
  var qPrime = new BigInteger(this.getValue(elements, "qPrime", null));

  return new IssuerPrivateKey(issuerPubKey, n, p, pPrime, q, qPrime);
};

Parser.prototype.parseIssuerPublicKey = function(xmlDoc) {
  // References
  var references = xmlDoc.getElementsByTagName("References").item(0);
  var groupParamsLocation = this.getValue(references, "GroupParameters", null);
	var groupParams = StructureStore.getInstance().get(groupParamsLocation, null);

  // Elements
  var elements = xmlDoc.getElementsByTagName("Elements").item(0);
  var capS = new BigInteger(this.getValue(elements, "S", null));
  var capZ = new BigInteger(this.getValue(elements, "Z", null));
  var n = new BigInteger(this.getValue(elements, "n", null));
  var capR = this.parseBases(elements);

  return new IssuerPublicKey(groupParams, capS, capZ, capR, n);
};

Parser.prototype.parseBases = function(elements) {
  var bases = elements.getElementsByTagName("R")[0];
  var num = bases.getAttribute("num");
  var capR = new Array();
  for ( var i = 0; i < num; i++)
    capR[i] = new BigInteger(this.getValue(bases, "R_" + i, null));

  return capR;
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