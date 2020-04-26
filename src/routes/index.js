const express = require('express');
const router = express.Router();
const xl = require('excel4node');
const async = require('async');
const nodemailer = require('nodemailer');
const Crypto = require('crypto');

const Flyer = require('../models/flyer');
const Can = require('../models/curriculums');
const Use = require('../models/user');
const passport = require('passport');
const Dstr = require('../models/districts');
const User = require('../models/user');
const Cach = require('../models/cachuelos');


// Initilization
require('../passport/local-auth');

// Create a new instance of a Workbook class
var wb = new xl.Workbook(
   
);
 
// Add Worksheets to the workbook
var ws = wb.addWorksheet('Sheet 1');
var ws2 = wb.addWorksheet('Sheet 2');
var ws3 = wb.addWorksheet('Sheet 3');

// Create a reusable style
var style = wb.createStyle(
  {
  alignment: {
    horizontal: 'justify',}},
    {
  font: 
  {
    color: 'black',
    size: 12,
  },
  //numberFormat: '$#,##0.00; ($#,##0.00); -',
});

var style2 = wb.createStyle(
  {
font: {
    color: 'black',
    bold: true,
    size: 12,
    position: 'left',
  },
  //numberFormat: '$#,##0.00; ($#,##0.00); -',
});


// GET THE HOMEPAGE SITE
  router.get('/', async (req, res) => {
    //const tests = await Tests.find();
    //console.log(test);
    //res.render('test', {
    //    tasks
   // });
    res.render('signin');
  });


  // GET the local form page
  router.get('/local-form', isAuthenticated, async (req, res) => {

    const distr = await Dstr.find().sort({'district': 1});
    res.render('local_form', {distr});
  
  });

  // GET the cachuelo form page
  router.get('/cachuelo-form', isAuthenticated, async (req, res) => {

    const distr = await Dstr.find().sort({'district': 1});
    res.render('cachuelo_form', {distr});
  
  });

  //POST we add new info into the cachuelos form
router.post('/add-form-cachuelos', async (req, res) => {
  const addcv =  new Cach(req.body);
  await addcv.save();
  
  //console.log(addcv);
  res.redirect('/profile');

});

  router.get('/candidates', isAuthenticated, async (req, res) => {
    const can = await Can.find();
    console.log(can);
    res.render('candidates', {can});
  });


//POST we add new info into the form - this is an example
router.post('/add-form', async (req, res) => {
    const addcv = new Flyer(req.body);
    await addcv.save();
    
    //console.log(addcv);
    res.redirect('/jobs');

});

// GET all JOBS from database
router.get('/jobs', isAuthenticated, async (req, res) => {
  const yo = await Dstr.find().sort({'district': 1});
  const flyer = await Flyer.find();
  const distr = await Dstr.find();
  console.log(flyer);
  res.render('jobs', {flyer, yo, distr});
});

// Delete FLYER posted from database
router.get('/remove-position/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const flyer = await Flyer.deleteOne({_id: id});
  req.flash("success", "Has eliminado exitosamente el aviso!");
  //res.send("Eliminado");
  res.redirect('/jobs');
    
});

// EDIT FLYER
router.get('/update-position/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const flyer = await Flyer.findById({_id: id});
  console.log(flyer);
  res.render('edit_local_form', {flyer});
      
});

router.post('/update-position/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const flyer = await Flyer.updateOne({_id: id}, req.body);
  console.log(flyer);
  req.flash("success", "Has cambiado exitosamente los datos!");
  res.redirect('/jobs');
      
});

// -------------------------------------------------------------------------------------

// Delete USER posted from database
router.get('/remove-user/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const user = await Use.deleteOne({_id: id});
  //res.send("Eliminado");
  req.flash("success", "Has eliminado exitosamente al usuario!");
  res.redirect('/admin-users');
    
});

// EDIT USER
router.get('/update-user/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const usuario = await Use.findById({_id: id});
  console.log(usuario);
  res.render('edit_user', {usuario});
      
});
// POST USER
router.post('/update-user/:id', async (req, res, next) =>
{
  const { id } = req.params;
  const usuario = await Use.updateOne({_id: id}, req.body);
  console.log(usuario);
  res.redirect('/admin-users');
      
});
// -------------------------------------------------------------------------------------

// Get password page
router.get('/forgot-password', async (req, res) => {
  res.render('forgot_password')

});

// POST forgot Password
router.post('/forgot-password', async (req, res, next) => {
  async.waterfall ([
    function(done) {
      Crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    
    function(token, done) {
      User.findOne({email: req.body.email}, function(err, user){
        if(!user){
          req.flash('error', 'No existe el correo. Por favor ingresa un correo valido.');
          console.log(req.flash);
          return res.redirect('back');
        }
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 36000000; // 1 hour

        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport ({
        service: 'Gmail',
        auth: {
          user: 'bchpeconsulting@gmail.com',
          pass: 'Stilldre18'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bchpeconsulting@gmail.com',
        subject: 'Recuperar Contraseña',
        text: 'Has recibido este email porque quieres recuperar tu contraseña' + ' ' + '\n\n' +
        'Dale click al siguiente enlace para modificar tu contraseña' + ' ' + 'http://' + req.headers.host + '/recovery-password/' + token + '\n\n' +
        'Saludos,' + '\n\n' +
        'BCHPE CONSULTING'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'Un e-mail ha sido enviado a'+ ' ' + user.email + ' ' +'para poder resetear la contraseña')
          done(err,'done');
        });
    }
  ], function(err) {
    if(err) return next(err);
    res.redirect('/forgot-password');
  });
});


// Get recovert without TOKEN page
router.get('/recovery-password/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
   if (!user) {
     req.flash('error', 'El toke es invalido o ha expirado.');
     return res.redirect('/forgot-password');
   }
     res.render('recovery_password', {token: req.params.token});
 });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// POST RECOVERY PASSWORD
router.post('/recovery-password/:token', function(req, res, password) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'El toke es invalido o ha expirado.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          
            user.password = user.encryptPassword(req.body.password) ;
            user.resetPasswordToken = undefined; 
            user.resetPasswordExpires = undefined;
            console.log('password' + user.password  + 'and the user is' + user)
            
            user.save(function(err) {
            
              req.login(user, function(err) {
                done(err, user);
              });
            });
          
        } else {
            req.flash("error", "Las contraseñas no coinciden. Por favor ingreselas de nuevo");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'bchpeconsulting@gmail.com',
          pass: 'bchpe2020'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bchpeconsulting@mail.com',
        subject: 'Tu contraseña ha sido modificada.',
        text: 'Hola,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Felicitaciones! Tu contraseña ha sido cambiada.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/profile');
  });
});

// Table Export
router.get('/export-excel/:table', isAuthenticated, async (req, res) => {
  const can = await Can.find();
  //ws.cell(1,1).string('No').style(style);
  for(var i=0; i < can.length; i++)
  {

    ws.row(2).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(20);


    ws.cell(1, 1).string('LISTA DE CANDIDATOS').style(style2);
    ws.cell(2, 1).string('NUMERO').style(style2);
    ws.cell(2, 2).string('NOMBRE').style(style2);
    ws.cell(2, 3).string('APELLIDO').style(style2);
    ws.cell(2, 4).string('NACIONALIDAD').style(style2);
    ws.cell(2, 5).string('POSICION').style(style2);
    ws.cell(2, 6).string('EXPERIENCIA').style(style2);
    ws.cell(2, 7).string('DISTRITO').style(style2);
    ws.cell(2, 8).string('CORREO').style(style2);
    ws.cell(2, 9).string('CELULAR').style(style2);
 
    ws.cell(i+3,1).number(i+1).style(style);
    ws.cell(i+3,2).string(can[i].name).style(style)
    ws.cell(i+3,3).string(can[i].lastname).style(style);
    ws.cell(i+3,4).string(can[i].nationality).style(style);
    ws.cell(i+3,5).string(can[i].position).style(style);
    ws.cell(i+3,6).string(can[i].time_experience).style(style);
    ws.cell(i+3,7).string(can[i].district).style(style);
    ws.cell(i+3,8).string(can[i].email).style(style);
    ws.cell(i+3,9).string(can[i].cellphone).style(style);
  }
  
  wb.write('Excel_bchpe.xlsx', res)
});


// Here I am creating the login requests

// GET SIGN UP
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST SIGN UP
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  passReqToCallback: true

}));

// GET SIGN IN
router.get('/', (req, res) => {
  res.render('signin');
});

// POST SIGN IN
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/',
  passReqToCallback: true

}));

// LOG OUT
router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
  
});

// GET PROFILE PAGE
router.get('/profile', isAuthenticated, (req, res, next) => {
  res.render('profile');
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
};

router.get('/admin-users', isAuthenticated, async (req, res) => {
  const use = await Use.find();
  console.log(use);
  res.render('admin_users', {use});
});

module.exports = router;