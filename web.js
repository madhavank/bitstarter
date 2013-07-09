var express = require('express');
var fs = require("fs");

var app = express.createServer(express.logger());


app.get('/', function(request, response) {
	var k = fs.readFileSync('/home/ubuntu/bitstarter/index.html','utf8');
	console.log(" The string value is " + k);
	response.send(str);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
