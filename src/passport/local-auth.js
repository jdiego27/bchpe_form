const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// User will pass trough different pages
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// User will find the user and then will receive
passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup' , new LocalStrategy ({
    
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    
}, async (req, email, password, done) => {

    const user = await User.findOne({email: email});
     if(user) {
        return done(null, false, req.flash('signupMessage', 'El correo ya existe'));
    }
    else {
        
    const newUser = new User();
    
    var name = req.body.name;
    var lastname = req.body.lastname;
    var cellphone = req.body.cellphone;
    var role = req.body.role;

    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.name = name;
    newUser.lastname = lastname;
    newUser.cellphone = cellphone;
    newUser.role = role;
        
    await newUser.save();
    done(null, newUser);

     }
    
}));


passport.use('local-signin' , new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, email, password, done) => {

    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, req.flash('signinMessage', 'No hay usuario encontrado'));
    }
    if(!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage','Password incorrecto'));
    }
    req.flash('success','Bienvenido a BCHPE Consulting');
    done(null, user);
}));