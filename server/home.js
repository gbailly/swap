// home page
app.get('/', function(req, res) {
  res.render('index', { layout: 'layout_default' });
});