const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const passportlocalmongoose = require('passport-local-mongoose');


const UsSchema = new mongoose.Schema({
    
    email: String,
    password: String,
    name: String,
    lastname: String,
    cellphone: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {type: Boolean, default: false}
     
});

UsSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UsSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users',UsSchema); //Here we pass the collection name (created) and the Schema above