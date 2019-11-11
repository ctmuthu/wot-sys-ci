const request = require('request');
const sleep = require('sleep');
async function main() {
  request('http://localhost:3005/api/tds', async (err, res, body) => {
	if (err) { return console.log(err); }
	tds = JSON.parse(body);
	console.log(tds.length);
	for (var i = 0; i < tds.length; i++) {
	  td = tds[i];
	  console.log(td.id);
	  td = JSON.stringify(td.td);
	  url = 'http://localhost:8980/wot-test-bench/actions/fastTest';
	  body = td;
	  sleep.sleep(5);
	  let res = await doPost(url, body);
	  console.log(res);
	}
  });
}
function doPost(url, body) {
  console.log("Sending Request");
  return new Promise(function (resolve, reject) {
	request.post({url,body}, function (error, res, body) {
	  if (!error && res.statusCode == 200) {
		resolve(body);
	  } else {
		reject(error);
	  }
	});
  });
}
main();
