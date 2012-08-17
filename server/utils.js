// load file
app.get('/loadxmldoc/:directory/:subdirectory/:filename', function(req, res) {
	var fn = fileLocation + req.params.directory + '/' + req.params.subdirectory + '/' + req.params.filename;
	
  try {
    var data = fs.readFileSync(fn, 'utf8');
    console.info('reading ' + fn);
  }
  catch (err) {
    console.error("There was an error opening the file " + fn);
    console.log(err);
  }

  res.end(data);
});

// load file
app.get('/loadxmldoc/:directory/:filename', function(req, res) {
	var fn = fileLocation + req.params.directory + '/' + req.params.filename;
	
  try {
    var data = fs.readFileSync(fn, 'utf8');
    console.info('Reading ' + fn);
  }
  catch (err) {
    console.error("There was an error opening the file " + fn);
    console.log(err);
  }

  res.end(data);
});