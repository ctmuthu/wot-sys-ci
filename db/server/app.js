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
      {method: 'GET', path: '/api/td/', description: 'Get All TD information'},
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
app.get('/api/td/', (req, res) => {
  /*
   * use the td model and query to mongo database to get all tds
   */
  db.td.find({}, function (err, td) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(td);
  });
});

/*
 * Add a TD into database
 */
app.post('/api/td/', (req, res) => {
  /*
   * New TD information in req.body
   */
  console.log(req.body);
  /*
   * use the td model and create a new object
   * with the information in req.body
   */
	db.td.create(req.body, (err, newTD) => {
    if (err) throw err;
    /*
     * return the new td information object as json
     */
    res.json(newTD);
  });
});

/*
 * Update a TD information based upon the specified ID
 */
app.put('/api/td/:id', (req, res) => {
  /*
   * Get the TD ID and new information of TD from the request parameters
   */
  const TDId = req.params.id;
  const TDNewData = req.body;
  console.log(`TD ID = ${TDId} \n TD Data = ${TDNewData}`);
  /*
   * use the td model and find using the TDId and update the TD information
   */
  db.td.findOneAndUpdate({_id: TDId}, TDNewData, {new: true},
                            (err, updatedTDInfo) => {
    if (err) throw err;
    /*
     * Send the updated TD information as a JSON object
     */
    res.json(updatedTDInfo);
  });
});

/*
 * Delete a TD based upon the specified ID
 */
app.delete('/api/td/:id', (req, res) => {
  /*
   * Get the td ID of td from the request parameters
   */
  const TDId = req.params.id;
  /*
   * use the td model and find using the TDId and delete the td
   */
  db.td.findOneAndRemove({_id: TDId}, (err, deletedTD) => {
    if (err) throw err;
    /*
     * Send the deleted TD information as a JSON object
     */
    res.json(deletedTD);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server is up and running on http://localhost:3000/');
})
