const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const xl = require('excel4node');
const publicDir = require('path').join(__dirname, 'public');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const favicon = require('serve-favicon');

//Initializations
const app = express();
require('./passport/local-auth');

/*
//Connecting to db TO MY LOCAL
mongoose.connect('mongodb://localhost/BCHPEDB', {useNewUrlParser: true});
mongoose.connection
.once('open', () => console.log('Local DB is connected'))
.on('error',err => console.log('Your', err));
*/


//Connecting DB to Atlas Mongodb
mongoose.connect('mongodb+srv://root:root@clustertest-rnhw7.mongodb.net/BCHPEDB?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.connection
.once('open', () => console.log('Atlas PROD DB is connected'))
.on('error',err => console.log('Your', err));


// Importing routes
const indexRoutes = require('./routes/index');


// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.static(publicDir));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false

}));
app.use(flash()); // to change between pages
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.signinMessage = req.flash('signinMessage');
    
  app.locals.user = req.user;
  next();
});


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



//routes
app.use('/', indexRoutes);

// FAVICON MIDDLEWARE
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})