BigInteger.prototype.toJSONString = function() {
  return '"' + this.toString() + '"';
};

BigInteger.fromJSONObject = function(bigIntegerJSONObject) {
  return new BigInteger(bigIntegerJSONObject);
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