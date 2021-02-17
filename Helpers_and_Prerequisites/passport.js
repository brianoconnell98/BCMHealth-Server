//www.passport.org/docs/
//https://www.youtube.com/watch?v=6FOq4cUdH8k
import {passportLocal, mongoose, bcrypt} from "./libs_required.js"
const LocalStrategy = passportLocal.Strategy;

// Load Patient Model
import {Patient} from '../DB/Models/patient.js';

const instantiate = function(passport) {
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

export default instantiate