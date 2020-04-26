const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.pluralize(null); //This is to prevent to add an "S" in a new collection

const CvSchema = new Schema({
    name: String,
    lastname: String,
    nationality: String,
    position: String,
    time_experience: String,
    district: String,
    email: String,
    cellphone: String,
      
});

module.exports = mongoose.model('curriculums',CvSchema); //Here we pass the collection name (created) and the Schema above