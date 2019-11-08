const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const jenkinsSchema = new Schema({
	url: String,
	username: String,
	password: String
 });

const jenkinsModel = mongoose.model('jenkins', jenkinsSchema);
module.exports = jenkinsModel;
