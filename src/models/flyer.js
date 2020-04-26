const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobsSchema = new Schema({
    position: String,
    district: String,
    contact: String,
    ruc: String,
    description:{
        header: String,
        line_1: String,
        line_2 : String,
        line_3 : String,
        line_4 : String,
        line_schedule: String,
        line_notes: String,
    },
    cellphone: String,
    email: String,
    salary: Number,
    posting_date: String,
    end_date: String,
    vacancy: Number,
    initial_time_stamp: { 
        type: Date, 
        default: new Date },
    last_time_stamp: {
        type: Date, 
        default: new Date(Date.now() + 20*24*60*60000)
    },

});

module.exports = mongoose.model('jobs', JobsSchema);

