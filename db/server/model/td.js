const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const TDSchema = new Schema({
	id: {type:String, required:true}, // ID of the TD
	description: {type:String, required:true}, // Thing Description
 });

const TDModel = mongoose.model('td', TDSchema);
module.exports = TDModel;
