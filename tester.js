const request = require('request');
const sleep = require('sleep');
request('http://localhost:3005/api/tds', (err, res, body) => {
  if (err) { return console.log(err); }
  tds = JSON.parse(body);
  console.log(tds.length);
  for (var i = 0; i < tds.length; i++) {
	td = tds[i];
	console.log(td.description);
	td = JSON.stringify(td.description);
	request.post({
      url: 'http://localhost:8980/wot-test-bench/actions/fastTest',
      body: td
    }, function(error, response, body){
			console.log(response);
		});
	sleep.sleep(30);
  }
});
