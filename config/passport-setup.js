const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new localStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true


}, (req, username, password, done) => {
    console.log(username)
    console.log(password)
    if (req.body.password != req.body.confirm_password) {
        return done(null, false, req.flash('signupError', 'passwords do not match'))
    }
    User.findOne({ email: username }, (err, user) => {
        if (err) {

            return done(err)
        }
        if (user) {
            return done(null, false, req.flash('signupError', 'Email already used'))
        }
        if (!user) {
            //create user 
            let newUser = new User()
            newUser.email = req.body.email
            newUser.password = newUser.hashPassword(req.body.password)
            newUser.avatar='profile.png'
            newUser.save((err, user) => {
                if (!err) {
                    return done(null, user, req.flash('success', 'user added'))

                } else console.log(err)

            })
        }
    })
}))


passport.use('local.login', new localStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true


}, (req, username, password, done) => {
    // console.log(username)
    // console.log(password)

    User.findOne({ email: username }, (err, user) => {
        if (err) {

            return done(null, false, req.flash('loginError', 'Something wrong happened'))
        }
        if (!user) {
            // console.log('no user')

            return done(null, false, req.flash('loginError', 'Email not found'))
        }
        let checkPass = user.comparePasswords
        (password, user.password)
        if(!checkPass) {
            // console.log(checkPass)
            return done (null, false, req.flash(
                'loginError', 'Wroung password')
            )
        }
        if (checkPass) {
            return done(null, user, req.flash('success', `Weclome back `))

        }

        //    if (password==user.)
        //create user 

        //     if (!err) {
        //         return done(null, user, req.flash('success', 'user added'))

        //     } else  console.log(err) 

        // })

    })
}))

