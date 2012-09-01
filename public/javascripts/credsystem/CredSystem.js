CredSystem = function() {
}

CredSystem.generateMasterSecret = function() {
	// run the generation protocol
	Utils.postToURL('/setup', null, null);
};

CredSystem.issueCredential = function() {
	// init the structures required for the issuance
	// and create the issuance specification
	var issuanceSpec = Locations.initRecipient();
	var issuerPubKey = issuanceSpec.getPublicKey();
	var systemParams = issuerPubKey.getGroupParams().getSystemParams();
	
	// build the master secret given the user's choice
	var masterSecretSelectionList = document.getElementById("master_secret_selection_list");
	var masterSecretJSONString = masterSecretSelectionList.options[masterSecretSelectionList.selectedIndex].value;
	var masterSecret = MasterSecret.fromJSONObject(eval('(' + masterSecretJSONString + ')'));
	
	// TODO ensure appropriate input has been inserted
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var gender = document.getElementById("gender").value;
	var dateOfBirth = new Date(document.getElementById("dob").value);
	var nationality = document.getElementById("nationality").value;
  
	// Recipient knows all the values
	var valuesRecipient = new Values(systemParams);
	// firstName is hidden
	var firstNameValue = new BigInteger(Utils.stringToByteArray(firstName));
	valuesRecipient.add("firstName", firstNameValue);
	// lastName is committed
	var random = CommitmentOpening.genRandom(issuerPubKey.getN(), systemParams.getL_n());
	var lastNameValue = new BigInteger(Utils.stringToByteArray(lastName));
	var lastNameCommOpen = new CommitmentOpening(null, lastNameValue,	null,
		random, null, null, null, null, issuerPubKey);
	valuesRecipient.add("lastName", lastNameCommOpen);
	// gender is hidden
	var genderValue = new BigInteger(Utils.stringToByteArray(gender));
	valuesRecipient.add("gender", genderValue);
	// dateOfBirth is committed
	random = CommitmentOpening.genRandom(issuerPubKey.getN(), systemParams.getL_n());
	var dobCommOpen = new CommitmentOpening(null, Utils.encodeDate(dateOfBirth), null,
		random, null, null, null, null, issuerPubKey);
	valuesRecipient.add("dateOfBirth", dobCommOpen);
	// nationality is hidden
	var nationalityValue = new BigInteger(Utils.stringToByteArray(nationality));
	valuesRecipient.add("nationality", nationalityValue);

	// Issuer doesn't get to know any of the values (for some he only
	// has a commitment, and some others are totally hidden to him)
	var valuesIssuer = new Values(systemParams);
	// lastName is committed
	var lastNameComm = new Commitment(lastNameCommOpen.getCommitmentValue(), null, null, null, null, issuerPubKey);
	valuesIssuer.add("lastName", lastNameComm);
	// dateOfBirth is committed
	var dobComm = new Commitment(dobCommOpen.getCommitmentValue(), null, null, null, null, issuerPubKey);
	valuesIssuer.add("dateOfBirth", dobComm);

	// init the recipient
	var recipient = new Recipient(issuanceSpec, null, null, null, masterSecret, valuesRecipient);
	
	// store the recipient in temporary memory for later use
	Store.save(recipient);
	
	// update progression
	Utils.updateProgression(5, "Please wait while a new credential is being issued...");
	
	// run the issuance protocol
	Utils.postToURL('/issue', valuesIssuer.toJSONString(), "round0");
};

CredSystem.prove = function() {
	sessionStorage.setItem("startTime", new Date().getTime());
	// init the structures required for the proof
	// and create the proof specification
	var proofSpec = Locations.initProver();
	
	// build the credential given the user's choice
	var credentialSelectionList = document.getElementById("credential_selection_list");
	var credentialJSONString = credentialSelectionList.options[credentialSelectionList.selectedIndex].value;
	var credential = Credential.fromJSONObject(eval('(' + credentialJSONString + ')'));
	
	// get the master secret from the credential
	var masterSecret = credential.getMasterSecret();
	
  // add the credential(s) to the currently used credentials
  var credentialMap = new Object();
  credentialMap[proofSpec.getCredTempNames()[0]] = credential;
	
	// init the prover
	var prover = new Prover(masterSecret, credentialMap, proofSpec, null, null);
	
	// store the prover in temporary memory for later use
	Store.save(prover);
	
	// update progression
	Utils.updateProgression(5, "Please wait while your credential is being verified...");

  // run the prove protocol
	Utils.postToURL('/prove', null, "proof");
};