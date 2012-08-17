CredSystem = function() {
}

CredSystem.generateMasterSecret = function() {
	// run the generation protocol
	Utils.postToURL('/setup', null, null);
};