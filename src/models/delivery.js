const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.pluralize(null); //This is to prevent to add an "S" in a new collection

const CvSchema = new Schema({
    name: String,
    lastname: String,
    nationality: String,
    document_identity: String,
    cellphone: String,
    transport: String,
    plate: String,
    district: String,
      
});

module.exports = mongoose.model('delivery',CvSchema); //Here we pass the collection name (created) and the Schema above