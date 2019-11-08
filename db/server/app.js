const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const db = require('./model/td.js');
const dbJenkins = require('./model/jenkins.js');

mongoose.connect('mongodb://localhost:27017/tdDB');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  res.json({
	message: 'MongoDB for WOT-sys',
	documentationUrl: '',
	baseUrl: '',
	endpoints: [
	  {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
	  {method: 'GET', path: '/api/tds/', description: 'Get All latest version TD information'},
	  {method: 'GET', path: '/api/td/', description: 'Get a TD information'},
	  {method: 'POST', path: '/api/td/', description: 'Insert a new TD information'},
	  {method: 'PUT', path: '/api/td/', description: 'Update a TD information, based on id'},
	  {method: 'DELETE', path: '/api/td/', description: 'Delete a TD information, based on id'},
	  // TODO: Write API end-points description here, if any new API is added
	]
  })
});

app.get('/', function(req, res){
  res.send('Please use /api/...');
});

/*
 * Get All TDs information
 */
app.get('/api/tds/', async (req, res) => {
  try {
	var result = await db.find({version: {"$eq": 1}}).exec();
	res.send(result);
  } catch (error) {
	res.status(500).send(error);
  }
});

/*
 * Get a TD information
 */
app.get('/api/td/:id', async (req, res) => {
  try {
	var foundTd = await db.find({id: {"$eq": req.params.id}}).exec();
	res.send(foundTd);
  } catch (error) {
	res.status(500).send(error);
  }
});
/*
 * Add a TD into database
 */
app.post('/api/td/', async (req, res) => {
  try {
	var latestTD;
	var proceed = 1;
	req.body.id = req.body.description.id;
	var existingCount = await db.find({id: req.body.id}).count().exec();
	if (existingCount === 0)
	  req.body.version = 1;
	else {
	  latestTD = await db.find({id: req.body.id, version: 1}, {description: 1, _id: 0}).exec();
	  if(isEquivalent(latestTD[0].description,req.body.description)) {
		proceed = 0;
		res.status(500).send("Same as latest TD");
	  }
	}
	if (proceed) {
	  if (existingCount === 5) {
		await db.remove({ id: req.body.id, version: 5}).exec();
		existingCount = 4;
	  }
	  if (existingCount > 0){
		for (var i = existingCount; i > 0; i--) {
		  await db.updateOne({ id: req.body.id, version: i},
			{$set: { "version" : i+1 }});
		}
		req.body.version = 1;
	  }
	  var currentTd = new db(req.body);
	  var result = await currentTd.save();
	  res.send(result);
	  var jenkinsCredential = await dbJenkins.find({}).exec();
	  console.log(jenkinsCredential[0].url);
	  var url = jenkinsCredential[0].url;
	  var user = jenkinsCredential[0].username;
	  var pass = jenkinsCredential[0].password;
	  var jenkins = require('jenkins')(
		{ baseUrl: 'http://'.concat(user,":",pass,"@",url), crumbIssuer: true });
	  jenkins.job.build('db_test', function(err, data) {
		if (err) throw err;
		console.log('queue item number', data);
	  });
	}
  } catch (error) {
	res.status(500).send(error);
  }
});

/*
 * Update a TD information based upon the specified ID
 */
app.put('/api/td/:id', async(req, res) => {
  //TODO: if required
});

/*
 * Delete a TD based upon the specified ID
 */
app.delete('/api/td/:id', async (req, res) => {
  try {
	var result = await db.remove({id: {"$eq": req.params.id}}).exec();
	res.send(result);
  } catch (error) {
	res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3005, () => {
  console.log('Express server is up and running on http://localhost:3005/');
})

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
