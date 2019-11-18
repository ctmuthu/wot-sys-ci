const request = require('request');
const sleep = require('sleep');
const fs = require('fs');
var results = [];
async function main() {
  request('http://localhost:8080/api/tds', async (err, res, body) => {
	if (err) { return console.log(err); }
	tds = JSON.parse(body);
	console.log(tds.length);
	for (var i = 0; i < tds.length; i++) {
	  td = tds[i];
	  console.log(td.id);
	  tdStr = JSON.stringify(td.td);
	  url = 'http://localhost:8980/wot-test-bench/actions/fastTest';
	  body = tdStr;
	  sleep.sleep(5);
	  let [res, resBody] = await doPost(url, body);
	  //console.log(res);
	  var errors = JSON.parse(resBody);
	  var testCount = errors[0][0].length*2;
	  var passed = 0;
	  var failed = 0;
	  var array;
	  for (var j = 0;j < errors[0].length; j++) {
		array = errors[0][j];
		for(var k = 0;k < array.length; k++) {
		  if (array[k].errorId < 399)
			passed = passed + 1;
		}
	  }
	  failed = testCount - passed;
	  var logFilename;
	  if(td.id) 
		logFilename = "../Results/".concat(td.id,"_log.txt"); 
	  else 
		logFilename = "../Results/".concat(i.toString(),"_noID_log.txt");

	  var resultFilename;
	  if(td.id) 
		resultFilename = "../Results/".concat(td.id,"_report.json"); 
	  else 
		resultFilename = "../Results/".concat(i.toString(),"_noID_report.json");

	  logFilename = logFilename.replace(/:/g,"_");
	  resultFilename = resultFilename.replace(/:/g,"_");

	  fs.writeFile(logFilename, res, 'utf8', function (err) {
		if (err) console.log("Unalbe to write",logFilename);
	  });
	  fs.writeFile(resultFilename, JSON.stringify(errors, null, 4), function (err) {
		if (err) console.log("Unalbe to write",resultFilename);
	  });
	  results.push({
		id: td.id,
		consoleLog: logFilename,
		testCount: testCount,
		errors: { Passed : passed, Failed : failed},
		testbenchReport: resultFilename});
	}
	fs.writeFile("../Results/Results.json", JSON.stringify(results, null, 4),function (err) {
        if (err) console.log("Unalbe to write Result.json",);
    });
  });
}
function doPost(url, body) {
  console.log("Sending Request");
  return new Promise(function (resolve, reject) {
	request.post({url,body}, function (error, res, body) {
	  if (!error && res.statusCode == 200) {
		resolve([res,body]);
	  } else {
		reject(error);
	  }
	});
  });
}
main();
