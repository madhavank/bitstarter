#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
// added for hw3
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "url.file"
var OUT_FILE_NAME = "./outputfile.html"


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
 //       console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
  //  console.log("passed HTML file = " + htmlfile);
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

/*
var urlCheck = function() {
	console.log("Control comes here");
}
*/

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url', 'Url of html file')
        .parse(process.argv);
/*

    console.log("After parsing, process.argv is = " + process.argv[5]);
    console.log("After parsing, program is = " + program);
    console.log("After parsing, program.url is = " + program.url);
    console.log("After parsing, program.file is = " + program.file);
    console.log("After parsing, program.checks = " + program.checks);a
*/
//    console.log("After parsing, program.url is = " + program.url);
   if(program.url)
   {

	rest.get(process.argv[5]).on('complete',function(result) {
		fs.writeFileSync(OUT_FILE_NAME, result);
		program.file = OUT_FILE_NAME ;
//   	        console.log("Program.file assigned is " + program.file);	
 //  	        console.log("Program.checks assigned is " + program.checks);	
    		var checkJson = checkHtmlFile(program.file, program.checks);
    		var outJson = JSON.stringify(checkJson, null, 4);
//		console.log("result from rest.get function call is " + result) ;	
	//	console.log("Wrote into output3.html file") ;
    		console.log(outJson);
	});

   }
   else
   {
    	var checkJson = checkHtmlFile(program.file, program.checks);
   	var outJson = JSON.stringify(checkJson, null, 4);
    	console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}


//rest.get(apiurl).on('complete', response2console);
