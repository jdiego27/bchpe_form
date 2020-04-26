const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.pluralize(null); //This is to prevent to add an "S" in a new collection

const CvSchema = new Schema({
    district: String,   
});

module.exports = mongoose.model('districts', CvSchema); //Here we pass the collection name (created) and the Schema above