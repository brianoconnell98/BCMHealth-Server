const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
router = express.Router(),
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Patient model 
patient = require("../DB/Models/patient");
//const Patient = require('../models/patient');

//Login Page
router.get('/login', (req, res) => res.send('Login'));
//router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.send('Register'));
//router.get('/register', (req, res) => res.render('register'));


router.get("/", async(req, res)=>{
    const patients = await patient.find({})
    res.send(patients)
});

// Register Handle
router.post("/", async(req, res)=>{
    const newPatient = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
        //password: req.body.password
        //password2: req.body.password2
        //let errors = [];
    };
    

    // Register Handle
    // router.post('/register', (req, res) => {
    //     const { name, email, age, password, password2 } = req.body;
    //     let errors = [];
    // });

    // Check required fields
    // if(!name || !email || !age || !password || !password2) {
    //     errors.push({ msg: 'Please fill in all fields'});
    // }

    // Check passwords match
    //if(password !== password2) {
    //    errors.push({ msg: 'Passwords do not match'});
    //}

    // Check password length
    //if(password.length < 6) {
    //    errors.push({ msg: 'Password should be at least 6 characters long'});
    //}


    // if(errors.length > 0) {
        // res.render('register', {
        //     errors, 
        //     name,
        //     email,
        //     age,
        //     password,
        //     password2
        // });
    // } else {
    //     //Validation Pass
            //patient.findOne({ email: email })
            //.then(patient => {
                //if(patient) {
                    // User exists
                    //errors.push({ msg: 'Email is already registered' });
                    //res.render('register', {
                        //     errors, 
                        //     name,
                        //     email,
                        //     age,
                        //     password,
                        //     password2
                        // });
                //} else {
                    //const newPatient = new Patient({
                    //  name,
                    //  email,
                    //  age,
                    //  password
                    //});

                    // Crypt Password
                    // bcrypt.genSalt(10, (err, salt) => 
                    //     bcrypt.hash(newPatient.password, salt, (err, hash) =>{
                    //         if(err) throw err;
                    //         // Set password to hashed
                    //         newPatient.password = hash;
                    //         // Save user
                    //         newPatient.save()
                    //         .then(patient => {
                    //             req.flash('success_msg', 'You are now registered and can log in');
                    //             **Please note goes to messages.ejs to create another message  
                    //             res.redirect('/index/login');
                    //         })
                    //         .catch(err => console.log(err));
                    // }))
                //}
            //});
    // }

    let createdPatient = await patient.create(newPatient)
    res.send(createdPatient)
});



// // Login Handle // '/dashboard is an example'
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/patients/login',
//         failureFlash: true
//     })(req, res, next);
// });


module.exports = router;