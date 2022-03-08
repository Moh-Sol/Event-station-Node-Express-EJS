const express = require('express');
const router = express.Router();
const passport = require('passport');


var multer = require('multer');
const User = require('../models/user');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

var upload = multer({ storage: storage })












//middleware to check if user is logged in 

isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/user/login')
}




//  login user view

router.get('/login', (req, res) => {

    res.render('user/login.ejs', { loginError: req.flash('loginError') })


})

//  login post req

// router.post('/login', (req, res) => {
//     console.log(req.body)

//     res.json('login in user .. ')

// })


router.post('/login',
    passport.authenticate('local.login', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/login',
        failureFlash: true,

    }));

//  login user view

router.get('/signup', (req, res) => {

    res.render('user/signup', { signupError: req.flash('signupError') })

})

//  signup post req


router.post('/signup',
    passport.authenticate('local.signup', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signup',
        failureFlash: true,

    }));

//  profile user view
router.get('/profile', isAuthenticated, (req, res) => {


    res.render('user/profile', { success: req.flash('success') })

})


// uppload user image view
router.post('/uploadavatar', upload.single('avatar'), (req, res) => {
    let newFilelds = {
        avatar: req.file.filename
    }

    User.updateOne({ _id: req.user._id }, newFilelds, (err) => {

        if (err) console.log(err)
        if (!err) {
            res.redirect('/user/profile');
        }
    })
    console.log(req.file)

})

//  logout user view
router.get('/logout', (req, res) => {

    req.logout();
    res.redirect('/');

})

module.exports = router
