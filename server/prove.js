// prove possession of a credential
app.get('/prove', function(req, res) {
  res.render('prove', {
    nonce: null,
    success: null,
    fixedBaseWindowingMap: '{}',
    layout: 'layout'
  });
});

// prove possession of a credential
app.post('/prove', function(req, res) {
  var optionalValue = req.param('optional', null);
  if(optionalValue == "proof") {
    console.log("proof");
    // init proof specification
    var proofSpec = Locations.initVerifier();
    // init verifier
    verifier = new Verifier(proofSpec, null, null, null, null, null, null);
		if(Constants.FAST_EXPO) {
			verifier.setFixedBaseWindowingMap(fixedBaseWindowingMap);
		}
    var nonce1 = verifier.getNonce();
		// pass control to establish proof
    res.render('prove', {
      nonce: nonce1.toJSONString(),
      fixedBaseWindowingMap: fixedBaseWindowingMapJSONString,
      success: null,
      layout: 'layout'
    });
  }
  else if(optionalValue == "verify") {
    console.log("verify");
    // recover proof sent by prover
    var proofJSONString = req.param('data', null);
    var proofJSONObject = eval('(' + proofJSONString + ')');
    var proof = Proof.fromJSONObject(proofJSONObject);
    // init verifier
    verifier.setProof(proof);
    // pass control to display result
    res.render('prove', {
      nonce: null, 
	    fixedBaseWindowingMap: '{}',
      success: verifier.verify(), 
      layout: 'layout'
    });
  }
});