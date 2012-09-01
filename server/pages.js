// home page
app.get('/', function(req, res) {
  res.render('home', { layout: 'layout' });
});

// page describing functionalities
app.get('/functionalities', function(req, res) {
  res.render('functionalities', { layout: 'layout' });
});