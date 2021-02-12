//www.passport.org/docs/
//https://www.youtube.com/watch?v=6FOq4cUdH8k

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Patient Model
const Patient = require('../DB/Models/patient');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match Patient
            Patient.findOne({ email: email })
            .then(patient => {
                if(!patient) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match Password
                bcrypt.compare(password, patient.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, patient);
                    } else {
                        return done(null, false, { message: 'Password is incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    
    passport.serializeUser((patient, done) => {
        done(null, patient.id);
    });

    passport.deserializeUser((id, done) => {
        Patient.findById(id, (err, patient) => {
            done(err, patient);
        });
    });
}