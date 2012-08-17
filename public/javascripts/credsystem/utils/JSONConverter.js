AttributeStructure.prototype.toJSONString = function() {
  var primeFactorsString = '';
  if(this.primeFactors != null) {
    var isEmpty = true;
    for (var key in this.primeFactors) {
      primeFactorsString += '"' + key + '":' + this.primeFactors[key] + ',';
      isEmpty = false;
    }
    if(!isEmpty) {
      primeFactorsString = Utils.removeStringLastChar(primeFactorsString);
		}
  }
  var t = '';
  if (this.t != null)
    t = ',"t": ' + this.t;
  return '{"name":"' + this.name + '","pubKeyIndex":' + this.pubKeyIndex
  + ',"issuanceMode":"' + this.issuanceMode + '","dataType": "' + this.dataType
  + '", "primeFactors":{' + primeFactorsString + '}}';
};

AttributeStructure.fromJSONObject = function(attrStructJSONObject) {
	var name = null;
	var pubKeyIndex = null;
	var issuanceMode = null;
	var dataType = null;
	var primeFactors = null;
	
	for(var key in attrStructJSONObject) {
		if(key == "name") {
			name = attrStructJSONObject[key];
		}
		else if(key == "pubKeyIndex") {
			pubKeyIndex = parseInt(attrStructJSONObject[key]);
		}
		else if(key == "issuanceMode") {
			issuanceMode = attrStructJSONObject[key];
		}
		else if(key == "dataType") {
			dataType = attrStructJSONObject[key];
		}
		else if(key == "primeFactors") {
		}
	}
	
	return new AttributeStructure(name, pubKeyIndex, issuanceMode, dataType);
};

BigInteger.prototype.toJSONString = function() {
  return '"' + this.toString() + '"';
};

BigInteger.fromJSONObject = function(bigIntegerJSONObject) {
  return new BigInteger(bigIntegerJSONObject);
};

Commitment.prototype.toJSONString = function() {
	var i;
	var valueJSONString;
	var capSJSONString;
	var nJSONString;
	var baseListJSONString;
	
	valueJSONString = this.value.toJSONString(); // always defined
	capSJSONString = this.capS.toJSONString(); // always defined
	nJSONString = this.n.toJSONString(); // always defined
	
	baseListJSONString = '';
	for(i=0; i<this.baseList.length; i++) {
		baseListJSONString += this.baseList[i].toJSONString() + ',';
	}
	baseListJSONString = Utils.removeStringLastChar(baseListJSONString);
	
	return '{"value":' + valueJSONString + ',"capS":' + capSJSONString
		+ ',"n":' + nJSONString + ',"numBases":' + this.numBases + ',"baseList":[' + baseListJSONString + ']}';
};

Commitment.fromJSONObject = function(commitmentJSONObject) {
	var i;
	var value;
	var capS;
	var n;
	var numBases; // TODO remove numBases
	var baselist;
	
	value = BigInteger.fromJSONObject(commitmentJSONObject["value"]);
	capS = BigInteger.fromJSONObject(commitmentJSONObject["capS"]);
	n = BigInteger.fromJSONObject(commitmentJSONObject["n"]);
	numBases = parseInt(commitmentJSONObject["numBases"]);
	
	baseList = new Array();
	baseListJSONString = commitmentJSONObject["baseList"];
	for(i=0; i< baseListJSONString.length; i++) {
		baseList.push(BigInteger.fromJSONObject(baseListJSONString[i]));
	}
	
	return new Commitment(value, null, capS, n, baseList, null);
};

CommitmentOpening.prototype.toJSONString = function() {
	var i;
  var baseListJSONString = '';
	var messageListJSONString = '';
  var isEmpty = true;

  // bases
  for(i=0; i<this.baseList.length; i++) {
    baseListJSONString += this.baseList[i].toJSONString() + ',';
    isEmpty = false;
  }
  if(!isEmpty)
    baseListJSONString = Utils.removeStringLastChar(baseListJSONString);

  // messages
  for(i=0; i<this.messageList.length; i++) {
    messageListJSONString += this.messageList[i].toJSONString() + ',';
    isEmpty = false;
  }
  if(!isEmpty)
    messageListJSONString = Utils.removeStringLastChar(messageListJSONString);

  return '{"value":' + this.value.toJSONString() + ',"capS":' + this.capS.toJSONString()
  	+ ',"n":' + this.n.toJSONString() + ',"random":' + this.random.toJSONString() + ',"baseList":['
  	+ baseListJSONString + ']' + ',"messageList":[' + messageListJSONString + ']}';
};

CommitmentOpening.fromJSONObject = function(commOpeningJSONObject) {
	var value = null;
	var capS = null;
	var n = null;
	var random = null;
	var baseList = null;
	var messageList = null;
	
	for(var key in commOpeningJSONObject) {
		if(key == "value") {
			value = BigInteger.fromJSONObject(commOpeningJSONObject[key]);
		}
		else if(key == "capS") {
			capS = BigInteger.fromJSONObject(commOpeningJSONObject[key]);
		}
		else if(key == "n") {
			n = BigInteger.fromJSONObject(commOpeningJSONObject[key]);
		}
		else if(key == "random") {
			random = BigInteger.fromJSONObject(commOpeningJSONObject[key]);
		}
		else if(key == "baseList") {
			baseList = new Array();
			for(var i=0; i<commOpeningJSONObject[key].length; i++) {
				baseList[i] = BigInteger.fromJSONObject(commOpeningJSONObject[key][i]);
			}
		}
		else if(key == "messageList") {
			messageList = new Array();
			for(var i=0; i<commOpeningJSONObject[key].length; i++) {
				messageList[i] = BigInteger.fromJSONObject(commOpeningJSONObject[key][i]);
			}
		}
	}
	
  return new CommitmentOpening(null, null, capS, random, n, value, baseList, messageList);
};

CredentialStructure.prototype.toJSONString = function() {
  var attrStructJSONList = new Array();
  for ( var i in this.attrStructs) {
    attrStructJSONList[i] = this.attrStructs[i].toJSONString();
	}
  return '[' + attrStructJSONList + ']';
};

CredentialStructure.fromJSONObject = function(credStructJSONObject) {
	var attrStructList = new Array();
	
	for(var i=0; i<credStructJSONObject.length; i++) {
		attrStructList[i] = AttributeStructure.fromJSONObject(credStructJSONObject[i]);
	}
	
	return new CredentialStructure(attrStructList);
};

DomNym.prototype.toJSONString = function() {
  return '{"groupParamsLocation":"' + this.groupParamsLocation + '", "domNym":'
    + this.domNym.toJSONString() + ', "g_dom":' + this.g_dom.toJSONString() + '}';
};


DomNym.fromJSONObject = function(domNymJSONObject) {
  var groupParamsLocation = domNymJSONObject["groupParamsLocation"];
  var domNymNym = BigInteger.fromJSONObject(domNymJSONObject["domNym"]);
  var g_dom = BigInteger.fromJSONObject(domNymJSONObject["g_dom"]);
	
  return new DomNym(groupParamsLocation, domNymNym, g_dom);
};

GroupParameters.prototype.toJSONString = function() {
  return '{"capGamma":' + this.capGamma.toJSONString() + ',"rho":' + this.rho.toJSONString() + ',"g":'
		+ this.g.toJSONString() + ',"h":' + this.h.toJSONString() + ',"systemParams":' + this.systemParams.toJSONString() + '}';
};

GroupParameters.fromJSONObject = function(groupParamsJSONObject) {
	var systemParams = null;
	var capGamma = null;
	var rho = null;
	var g = null;
	var h = null;
	
	for(var key in groupParamsJSONObject) {
		if(key == "capGamma") {
			capGamma = BigInteger.fromJSONObject(groupParamsJSONObject[key]);
		}
		else if(key == "rho") {
			rho = BigInteger.fromJSONObject(groupParamsJSONObject[key]);
		}
		else if(key == "g") {
			g = BigInteger.fromJSONObject(groupParamsJSONObject[key]);
		}
		else if(key == "h") {
			h = BigInteger.fromJSONObject(groupParamsJSONObject[key]);
		}
		else if(key == "systemParams") {
			systemParams = SystemParameters.fromJSONObject(groupParamsJSONObject[key]);
		}
	}
	
	return new GroupParameters(capGamma, rho, g, h, systemParams);
};

IssuanceSpec.prototype.toJSONString = function() {
	var contextJSONString = '';
	if(this.context != null) {
		contextJSONString = ',"context":' + this.context.toJSONString();
	}
	
  return '{"issuerPubKeyLocation":"' + this.issuerPubKeyLocation + '","credStructLocation":"' + this.credStructLocation
		+ '","issuerPubKey":' + this.issuerPubKey.toJSONString() + ',"credStruct":'
		+ this.credStruct.toJSONString() + contextJSONString + '}';
};

IssuanceSpec.fromJSONObject = function(issuanceSpecJSONObject) {
	var key;
	var issuerPubKeyLocation = null;
	var credStructLocation = null;
	var issuerPubKey = null;
	var credStruct = null;
	var context = null;
	
	for(key in issuanceSpecJSONObject) {
		if(key == "issuerPubKeyLocation") {
			issuerPubKeyLocation = issuanceSpecJSONObject[key];
		}
		else if(key == "credStructLocation") {
			credStructLocation = issuanceSpecJSONObject[key];
		}
		else if(key == "issuerPubKey") {
			issuerPubKey = IssuerPublicKey.fromJSONObject(issuanceSpecJSONObject[key]);
		}
		else if(key == "credStruct") {
			credStruct = CredentialStructure.fromJSONObject(issuanceSpecJSONObject[key]);
		}
		else if(key == "context") {
			context = BigInteger.fromJSONObject(issuanceSpecJSONObject[key]);
		}
	}
	
	var issuanceSpec = new IssuanceSpec(issuerPubKeyLocation, credStructLocation, issuerPubKey, credStruct);
	issuanceSpec.setContext(context);
	return issuanceSpec;
};

IssuerPublicKey.prototype.toJSONString = function() {
  var capRJSONList = new Array();
  for(var i=0; i<this.capR.length; i++)
    capRJSONList[i] = this.capR[i].toJSONString();
  return '{"groupParams":' + this.groupParams.toJSONString() + ',"capS":' + this.capS.toJSONString()
  + ',"capZ":' + this.capZ.toJSONString() + ',"capRList":[' + capRJSONList + '],"n":' + this.n.toJSONString() + '}';
};

IssuerPublicKey.fromJSONObject = function(issuerPubKeyJSONObject) {
	var groupParams = null;
	var capS = null;
	var capZ = null;
	var capRList = null;
	var n = null;
	
	for(var key in issuerPubKeyJSONObject) {
		if(key == "groupParams") {
			groupParams = GroupParameters.fromJSONObject(issuerPubKeyJSONObject[key]);
		}
		else if(key == "capS") {
			capS = BigInteger.fromJSONObject(issuerPubKeyJSONObject[key]);
		}
		else if(key == "capZ") {
			capZ = BigInteger.fromJSONObject(issuerPubKeyJSONObject[key]);
		}
		else if(key == "capRList") {
			capRList = new Array();
			for(var i=0; i<issuerPubKeyJSONObject[key].length; i++) {
				capRList[i] = BigInteger.fromJSONObject(issuerPubKeyJSONObject[key][i]);
			}
		}
		else if(key == "n") {
			n = BigInteger.fromJSONObject(issuerPubKeyJSONObject[key]);
		}
	}
	
	return new IssuerPublicKey(groupParams, capS, capZ, capRList, n);
};

MasterSecret.prototype.toJSONString = function() {
  var key;
  
  var nymMapJSONString = '';
  for(key in this.nymMap) {
    nymMapJSONString += '"' + key + '":' + this.nymMap[key].toJSONString() + ',';
	}
  nymMapJSONString = Utils.removeStringLastChar(nymMapJSONString);

	var nymTildeMapJSONString = '';
  for(key in this.nymTildeMap) {
    nymTildeMapJSONString += '"' + key + '":' + this.nymTildeMap[key].toJSONString() + ',';
	}
  nymTildeMapJSONString = Utils.removeStringLastChar(nymTildeMapJSONString);
  
  var domNymMapJSONString = '';
  for(key in this.domNymMap) {
    domNymMapJSONString += '"' + key + '":' + this.domNymMap[key].toJSONString() + ',';
	}
  domNymMapJSONString = Utils.removeStringLastChar(domNymMapJSONString);

	var domNymTildeMapJSONString = '';
  for(key in this.domNymTildeMap) {
    domNymTildeMapJSONString += '"' + key + '":' + this.domNymTildeMap[key].toJSONString() + ',';
	}
  domNymTildeMapJSONString = Utils.removeStringLastChar(domNymTildeMapJSONString);
	
  return '{"groupParams":' + this.groupParams.toJSONString() + ',"value":' + this.value.toJSONString()
	+ ',"nymMap":{' + nymMapJSONString + '},"nymTildeMap":{' + nymTildeMapJSONString
	+ '},"domNymMap":{' + domNymMapJSONString + '},"domNymTildeMap":{' + domNymTildeMapJSONString + '}}';
};

MasterSecret.fromJSONObject = function(masterSecretJSONObject) {
	var groupParams = null;
	var value = null;
	var nymMap = null;
	var nymTildeMap = null;
	var domNymMap = null;
	var domNymTildeMap = null;
	
	for(var key in masterSecretJSONObject) {
		if(key == "groupParams") {
			groupParams = GroupParameters.fromJSONObject(masterSecretJSONObject[key]);
		}	else if(key == "value") {
			value = BigInteger.fromJSONObject(masterSecretJSONObject[key]);
		}	else if(key == "nymMap") {
			nymMap = new Object();
			for(var nymKey in masterSecretJSONObject[key]) {
				nymMap[nymKey] = Nym.fromJSONObject(masterSecretJSONObject[key][nymKey]);
			}
		}	else if(key == "nymTildeMap") {
			nymTildeMap = new Object();
			for(var nymTildeKey in masterSecretJSONObject[key]) {
				nymTildeMap[nymTildeKey] = Nym.fromJSONObject(masterSecretJSONObject[key][nymTildeKey]);
			}
		}	else if(key == "domNymMap") {
			domNymMap = new Object();
			for(var domNymKey in masterSecretJSONObject[key]) {
				domNymMap[domNymKey] = DomNym.fromJSONObject(masterSecretJSONObject[key][domNymKey]);
			}
		}	else if(key == "domNymTildeMap") {
			domNymTildeMap = new Object();
			for(var domNymTildeKey in masterSecretJSONObject[key]) {
				domNymTildeMap[domNymTildeKey] = DomNym.fromJSONObject(masterSecretJSONObject[key][domNymTildeKey]);
			}
		}
	}
	
	var masterSecret = new MasterSecret(value, groupParams, nymMap, domNymMap);
	masterSecret.setNymTildeMap(nymTildeMap);
	masterSecret.setDomNymTildeMap(domNymTildeMap);
  return masterSecret;
};

Nym.prototype.toJSONString = function() {
  var randomJSONString = '';
  if(this.random != null)
    randomJSONString = ',"random":' + this.random.toJSONString();
  
  var nymJSONString = '';
  if(this.nym != null)
    nymJSONString = ',"nym":' + this.nym.toJSONString();
	
  return '{"groupParams":' + this.groupParams.toJSONString() + randomJSONString
    + nymJSONString + ',"name":"' + this.name + '"}';
};

Nym.fromJSONObject = function(nymJSONObject) {
	var groupParams = null;
	var random = null;
	var nymNym = null;
	var name = null;
	
	for(var key in nymJSONObject) {
    if(key == "groupParams") {
			groupParams = GroupParameters.fromJSONObject(nymJSONObject[key]);
		} else if(key == "random") {
			random = BigInteger.fromJSONObject(nymJSONObject[key]);
		} else if(key == "nym") {
			nymNym = BigInteger.fromJSONObject(nymJSONObject[key]);
		} else if(key == "name") {
			name = nymJSONObject[key];
		}
  }
	
	var nym = new Nym(groupParams, null, name);
	nym.setRandom(random);
	nym.setNym(nymNym);
	
	return nym;
};

Recipient.prototype.toJSONString = function() {
  var nym = '';
  var nymName = '';
  var domNymName = '';

  if(this.nym != null)
    nym = ',"nym:' + this.nym.toJSONString();
  if(this.nymName != null)
    nymName = '","nymName":' + this.nymName;
  if(this.domNymName != null)
    domNymName = ',"domNymName":' + this.domNymName;

  var isEmpty = true;
  var issuanceValues = '';

  if(this.vPrime != null) {
    issuanceValues += '"vPrime":' + this.vPrime.toJSONString() + ',';
    isEmpty = false;
  }

  if(this.capU != null) {
    issuanceValues += '"capU":' + this.capU.toJSONString() + ',';
    isEmpty = false;
  }

  if(this.mTildes != null) {
    var mTildesIsEmpty = true;
    var mTildesString = '';
    for(var key in this.mTildes) {
      mTildesString += '"' + key + '":' + this.mTildes[key].toJSONString() + ',';
      mTildesIsEmpty = false;
    }
    if(!mTildesIsEmpty) {
      mTildesString = mTildesString.substr(0, mTildesString.length - 1);
      issuanceValues += '"mTildes":{' + mTildesString + '},';
    }
  }

  if(this.n2 != null) {
    issuanceValues += '"n2":' + this.n2.toJSONString() + ',';
    isEmpty = false;
  }

  if(!isEmpty) {
    issuanceValues = issuanceValues.substr(0, issuanceValues.length - 1);
    issuanceValues = ',"issuanceValues":{' + issuanceValues + '}';
  }

  return '{"issuanceSpec":' + this.issuanceSpec.toJSONString() + ',"masterSecret":' + this.masterSecret.toJSONString()
		+ ',"values":' + this.values.toJSONString() + nym + nymName + domNymName + issuanceValues + '}';
};

Recipient.fromJSONObject = function(recipientJSONObject) {
	var key;
	var issuanceSpec = null;
	var masterSecret = null;
	var values = null;
	var issuanceValues = null;
	
	// init recipient first
	for(key in recipientJSONObject) {
		if(key == "issuanceSpec") {
			issuanceSpec = IssuanceSpec.fromJSONObject(recipientJSONObject[key]);
		} else if(key == "masterSecret") {
			masterSecret = MasterSecret.fromJSONObject(recipientJSONObject[key]);
		} else if(key == "values") {
			values = Values.fromJSONObject(recipientJSONObject[key]);
		}
	}
	
	var recipient = new Recipient(issuanceSpec, null, null, null, masterSecret, values);
	
	// then add existing issuanceValues
	for(key in recipientJSONObject) {
		if(key == "issuanceValues") {
			issuanceValues = recipientJSONObject[key];
			for(var issuanceValueKey in issuanceValues) {
				if(issuanceValueKey == "vPrime") {
					recipient.setVPrime(BigInteger.fromJSONObject(issuanceValues[issuanceValueKey]));
				} else if(issuanceValueKey == "capU") {
					recipient.setCapU(BigInteger.fromJSONObject(issuanceValues[issuanceValueKey]));
				} else if(issuanceValueKey == "mTildes") {
					var mTildes = issuanceValues[issuanceValueKey];
			    var mTildeMap = new Object();
			    for(var mTildeKey in mTildes) {
			      mTildeMap[mTildeKey] = BigInteger.fromJSONObject(mTildes[mTildeKey]);
					}
			    recipient.setMTildeMap(mTildeMap);
				} else if(issuanceValueKey == "n2") {
					recipient.setNonce2(BigInteger.fromJSONObject(issuanceValues[issuanceValueKey]));
				}
			}
		}
	}

  return recipient;
};

SystemParameters.prototype.toJSONString = function() {
  return '{"l_n":' + this.l_n + ',"l_Gamma":' + this.l_Gamma + ',"l_rho": ' + this.l_rho + ',"l_m":' + this.l_m
  + ',"l_res":' + this.l_res + ',"l_e": ' + this.l_e + ',"l_ePrime":' + this.l_ePrime + ',"l_v":' + this.l_v
	+ ',"l_Phi":' + this.l_Phi + ',"l_k":' + this.l_k + ', "l_H":' + this.l_H + ',"l_r":' + this.l_r + ',"l_pt":' + this.l_pt + '}';
};

SystemParameters.fromJSONObject = function(systemParamsJSONObject) {
	var l_n = parseInt(systemParamsJSONObject["l_n"]);
	var l_Gamma = parseInt(systemParamsJSONObject["l_Gamma"]);
	var l_rho = parseInt(systemParamsJSONObject["l_rho"]);
	var l_m = parseInt(systemParamsJSONObject["l_m"]);
	var l_res = parseInt(systemParamsJSONObject["l_res"]);
	var l_e = parseInt(systemParamsJSONObject["l_e"]);
	var l_ePrime = parseInt(systemParamsJSONObject["l_ePrime"]);
	var l_v = parseInt(systemParamsJSONObject["l_v"]);
	var l_Phi = parseInt(systemParamsJSONObject["l_Phi"]);
	var l_k = parseInt(systemParamsJSONObject["l_k"]);
	var l_H = parseInt(systemParamsJSONObject["l_H"]);
	var l_r =  parseInt(systemParamsJSONObject["l_r"]);
	var l_pt = parseInt(systemParamsJSONObject["l_pt"]);
	
	return new SystemParameters(l_n, l_Gamma, l_rho, l_m, l_res, l_e, l_ePrime, l_v, l_Phi, l_k, l_H, l_r, l_pt);
};

Value.prototype.toJSONString = function() {
	if(this.value instanceof BigInteger) {
  	return '{"value":' + this.value.toJSONString() + '}';
	}	else if(this.value instanceof CommitmentOpening) {
	  return '{"commitmentOpening":' + this.value.toJSONString() + '}';
	} else if(this.value instanceof Commitment) {
  	return '{"commitment":' + this.value.toJSONString() + '}';
	}
};

Value.fromJSONObject = function(valueJSONObject) {
	var key;
	var value = null;
	
	for(key in valueJSONObject) {
		if(key == "value") {
			value = BigInteger.fromJSONObject(valueJSONObject[key]);
		} else if(key == "commitmentOpening") {
			value = CommitmentOpening.fromJSONObject(valueJSONObject[key]);
		} else if(key == "commitment") {
			value = Commitment.fromJSONObject(valueJSONObject[key]);
		}
	}
	
	return new Value(value);
};

Values.prototype.toJSONString = function() {
	var key;
  var valuesJSONString = '';

  if (this.values != null) {
    for (key in this.values) {
      if(key != IssuanceSpec.MASTER_SECRET_NAME) {
					valuesJSONString += '"' + key + '":' + this.values[key].toJSONString() + ',';
			}
		}	
    valuesJSONString = Utils.removeStringLastChar(valuesJSONString);
  }

  return '{"systemParams":' + this.systemParams.toJSONString() + ',"valueMap":{' + valuesJSONString + '}}';
};

Values.fromJSONObject = function(valuesJSONObject) {
	var key;
	var systemParams = null;
	var valueMap = null;
	
	for(key in valuesJSONObject) {
		if(key == "systemParams") {
			systemParams = SystemParameters.fromJSONObject(valuesJSONObject[key]);
		} else if(key == "valueMap") {	
			valueMap = new Object();
			for(var valueKey in valuesJSONObject[key]) {
				valueMap[valueKey] = Value.fromJSONObject(valuesJSONObject[key][valueKey]);
			}
		}
	}
	
  var values = new Values(systemParams);
  values.setValues(valueMap);
  return values;
};