app.get('/setup', function(req, res) {
  res.render('setup', { step: null, layout: 'layout' });
});

// generate a new master secret
app.post('/setup', function(req, res) {
	// simply redirect the user to the generation page
	res.render('setup', { step: 'gen', layout: 'layout' });
});
