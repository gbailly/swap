Store = function() {
};


Store.RECIPIENT_KEY = 'swap#recipient';

Store.MASTER_SECRET_KEY_TYPE = "swap#mastersecret_";
Store.CREDENTIAL_KEY_TYPE = "swap#credential_";


Store.save = function(data) {
	var keyType = null;
	var dataName = null;
	
	// Overwrite the previous state of the entity if recipient/prover
	if(data instanceof Recipient) {
		sessionStorage.setItem(Store.RECIPIENT_KEY, escape(data.toJSONString()));
		return;
	} /*else if (data instanceof Prover) {
		
	}*/
	
	if(data instanceof MasterSecret) {
		keyType = Store.MASTER_SECRET_KEY_TYPE;
		dataName = document.getElementById("master_secret_name").value;
	} else if(data instanceof Credential) {
		keyType = Store.CREDENTIAL_KEY_TYPE;
		dataName = document.getElementById("cred_name").value;
	}
	
	if(localStorage) {
		for(var i=0; i<localStorage.length; i++) {
			if(localStorage.key(i) == (keyType + dataName)) {
				alert("Name already defined, please choose another one.");
			}
		}
		localStorage.setItem(keyType + dataName, escape(data.toJSONString()));
	}
};

Store.loadRecipient = function() {
  var recipientJSONString = unescape(sessionStorage.getItem(Store.RECIPIENT_KEY));
  var recipientJSONObject = eval('(' + recipientJSONString + ')');
  return Recipient.fromJSONObject(recipientJSONObject);
};

Store.loadMasterSecretMap = function() {
	var masterSecretMap = new Object();
	
	if(localStorage) {
		var masterSecretJSONObject = null;
		for(var i=0; i<localStorage.length; i++) {
			var key = localStorage.key(i);
			if(Utils.stringStartsWith(key, Store.MASTER_SECRET_KEY_TYPE)) {
				masterSecretJSONObject = eval('(' + unescape(localStorage.getItem(key)) + ')');
				masterSecretMap[key.substr(Store.MASTER_SECRET_KEY_TYPE.length, key.length - 1)]
					= MasterSecret.fromJSONObject(masterSecretJSONObject);
			}
		}
	}
	
	return masterSecretMap;
};