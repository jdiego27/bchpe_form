const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.pluralize(null); //This is to prevent to add an "S" in a new collection

const CvSchema = new Schema({
    position: String,
    district: String,
    contact: String,
    cellphone: String,
    posting_date: String,
    description: String,   
});

module.exports = mongoose.model('cachuelos',CvSchema); //Here we pass the collection name (created) and the Schema above