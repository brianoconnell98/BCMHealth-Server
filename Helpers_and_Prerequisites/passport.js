//www.passport.org/docs/
//https://www.youtube.com/watch?v=6FOq4cUdH8k
import {passportLocal, mongoose, bcrypt} from "./libs_required.js"
const LocalStrategy = passportLocal.Strategy;

// Load Patient Model // Load Physio Model
import {Patient} from '../DB/Models/patient.js';
import {Physio} from '../DB/Models/physio.js'

// // Nathaniel woodbury version of passport
// const instantiate = function(passport) {
//     passport.use(
//         new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//             Patient.findOne({ email: email}, (err,patient) => {
//                 if (err) throw err;
//                 if (!patient) return done(null, false, { message: 'The email provided is not registered'});
//                 bcrypt.compare(password, patient.password, (err, result) => {
//                     if (err) throw err;
//                     if (result === true) {
//                         return done(null, patient);
//                     } else {
//                         return done(null, false, { message: 'The password is incorrect' });
//                     }
//                 });
//             })
               
    //                Physio.findOne({ email: email}, (err,physio) => {
    //                 if (err) throw err;
    //                 if (!physio) return done(null, false, { message: 'The email provided is not registered'});
    //                 bcrypt.compare(password, physio.password, (err, result) => {
    //                     if (err) throw err;
    //                     if (result === true) {
    //                         return done(null, physio);
    //                     } else {
    //                         return done(null, false, { message: 'The password is incorrect' });
    //                     }
    //                 });
    //             });

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
        
            // Match Physio
            Physio.findOne({ email: email })
            .then(physio => {
                if(!physio) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match Password
                bcrypt.compare(password, physio.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, physio);
                    } else {
                        return done(null, false, { message: 'Password is incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    
    //serialize Patient
    passport.serializeUser((patient, done) => {
        done(null, patient.id);
    });

    passport.deserializeUser((id, done) => {
        Patient.findById(id, (err, patient) => {
            done(err, patient);
        });
    });

    //serialize Physio
    passport.serializeUser((physio, done) => {
        done(null, physio.id);
    });

    passport.deserializeUser((id, done) => {
        Physio.findById(id, (err, physio) => {
            done(err, physio);
        });
    });
}

export default instantiate