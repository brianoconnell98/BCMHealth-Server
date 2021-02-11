const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// App is mounted at http://localhost:8080/patients, anything after this is prefixed with this 


//Patient model 
patient = require("../DB/Models/patient");

router.get("/", async(req, res)=>{
    const patients = await patient.find({})
    res.send(patients)
});

// Register Handle
router.post("/", async(req, res)=>{
    const newPatient = {name: Name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password,
        password2: req.body.password2
    } = req.body,
    errors = [];

    // Check required fields
    if(!Name || !email || !age || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password !== password2) {
       errors.push({ msg: 'Passwords do not match'});
    }

    // Check password length
    if(password.length < 6) {
       errors.push({ msg: 'Password should be at least 6 characters long'});
    }


     if(errors.length > 0) {
        res.send(errors)
     } else {
        //Validation Pass
            patient.findOne({ email: email })
            .then(patient => {
                if(patient) {
                   // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                            errors, 
                            Name,
                            email,
                            age,
                            password,
                            password2
                        });
                } else {
                    const newPatient = new Patient({
                     Name,
                     email,
                     age,
                     password
                    });

                   // Crypt Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newPatient.password, salt, (err, hash) =>{
                            if(err) throw err;
                            // Set password to hashed
                            newPatient.password = hash;
                            // Save user
                            newPatient.save()
                            .then(patient => {
                                res.send('success_msg', 'You are now registered and can log in');
                                // **Please note goes to messages.ejs to create another message  
                            })
                            .catch(err => console.log(err));
                    }))
                }
            });
    }

    let createdPatient = await patient.create(newPatient)
    res.send(createdPatient)
});

router.get("/:name", async(req,res) => {
    const patientFound = await patient.find({name: req.params.name});
    res.send(patientFound);
})



// // Login Handle // '/dashboard is an example'
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: 'https://bcmhealth.netlify.app/success',
        failureRedirect: 'https://bcmhealth.netlify.app/login',
        failureFlash: true
    })(req, res, next);
});


module.exports = router;