// issue a credential
app.get('/issue', function(req, res) {
  res.render('issue', { message: "", step: "choose", fixedBaseWindowingMap: '{}', layout: 'layout_protocols' });
  // init issuer key pair and issuance spec
	var issuerData = Locations.initIssuer(issuerPrivKeyLocation);
  issuerKeyPair = issuerData[0];
  issuanceSpec = issuerData[1];
});

// issue a credential
app.post('/issue', function(req, res) {
  var optionalValue = req.param('optional', null);
  if(optionalValue == "round0") {
    // recover values from JSON string
    console.log("round0");
    var valuesJSONString = req.param('data', null);
    var valuesJSONObject = eval('(' + valuesJSONString + ')');
    var values = Values.fromJSONObject(valuesJSONObject);
    // init the issuer
    issuer = new Issuer(issuerKeyPair, issuanceSpec, null, null, values);
		if(Constants.FAST_EXPO) {
			issuer.setFixedBaseWindowingMap(fixedBaseWindowingMap);
		}
    // execute round 0
    var messageToRecipient = issuer.round0();
    // redirect the user
    res.render('issue', { message: messageToRecipient.toJSONString(), step: "round1",
			fixedBaseWindowingMap: fixedBaseWindowingMapJSONString, layout: 'layout_protocols'
    });
  }
  else if(optionalValue == "round2") {
    // recover message from recipient
    console.log("round2");
    var msgFromRecipientJSONString = req.param('data', null);
    var messageFromRecipientJSONObject = eval('(' + msgFromRecipientJSONString + ')');
    var msgFromRecipient = Message.fromJSONObject(messageFromRecipientJSONObject);
    // execute round 2
    var messageToRecipient = issuer.round2(msgFromRecipient);
    // redirect the user
    res.render('issue', { message: messageToRecipient.toJSONString(), step: "round3",
      fixedBaseWindowingMap: '{}', layout: 'layout_protocols'
    });
  }
});