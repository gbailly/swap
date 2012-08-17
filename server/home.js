// home page
app.get('/', function(req, res) {
  res.render('setup', { step: null, layout: 'layout_protocols' });
});