const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const db = require('./model/td.js');

mongoose.connect('mongodb://localhost:27017/stats');

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
      {method: 'GET', path: '/api/tds/', description: 'Get All TD information'},
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
		console.log('/api/td/');
        var result = await db.find().exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

/*
 * Get a TD information
 */
app.get('/api/td/:id', async (req, res) => {
		console.log('/api/td/:id');
		try {
		console.log(req.params.id);
        var foundTd = await db.findById(req.params.id).exec();
		console.log(foundTd);
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
				var currentTd = new db(req.body);
				var result = await currentTd.save();
				res.send(result);
		} catch (error) {
				console.log("TD not update" + error);
		}
});

/*
 * Update a TD information based upon the specified ID
 */
app.put('/api/td/:id', (req, res) => {
});

/*
 * Delete a TD based upon the specified ID
 */
app.delete('/api/td/:id', async (req, res) => {
	try {
        var result = await db.deleteOne({ _id: req.params.id }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server is up and running on http://localhost:3000/');
})
