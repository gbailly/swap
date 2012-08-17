Store = function() {
};


Store.MASTER_SECRET_KEY_TYPE = "swap#mastersecret_";
Store.CREDENTIAL_KEY_TYPE = "swap#credential_";


Store.save = function(data) {
	var keyType = null;
	var dataName = null;
	
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