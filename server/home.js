// home page
app.get('/', function(req, res) {
  res.render('index', { layout: 'layout_default' });
});

app.get('/setup', function(req, res) {
  res.render('setup', { step: null, layout: 'layout_protocols' });
});