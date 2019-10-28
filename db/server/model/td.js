const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const TDSchema = new Schema({
	id: String, // ID of the TD
	version: Number,
	description: {type:Object, required:true}, // Thing Description
	created: {type: Date, default: Date.now}
 });

const TDModel = mongoose.model('td', TDSchema);
module.exports = TDModel;
