var express = require('express');
var fs = require("fs");

var app = express.createServer(express.logger());


app.get('/', function(request, response) {
	var k = fs.readFileSync('./index.html','utf8');
	console.log(" The string value is " + k);
	response.send(k.toString('utf8',0,k.length));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
