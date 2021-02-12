const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
  router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// App is mounted at http://localhost:8080/patients, anything after this is prefixed with this

//Patient model
const Patient = require("../DB/Models/patient");

router.get("/", async (req, res) => {
  const patients = await Patient.find({});
  res.send(patients);
});

// Traversy Media https://www.youtube.com/watch?v=6FOq4cUdH8k
// Register Handle
router.post("/", async (req, res) => {
  const { name: Name, email, age, password } = req.body,
    password2 = req.body.password2;
  errors = [];

  // Check required fields
  if (!Name || !email || !age || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters long" });
  }

  if (errors.length > 0) {
    res.send(errors);
  } else {
    //Validation Pass
    const patientFound = await Patient.findOne({ email: email });
    if (patientFound) {
      // User exists
      errors.push({ msg: "Email is already registered" });
      res.send(errors);
    } else {
      const newPatient = new Patient({
        name: Name,
        email,
        age,
        password,
      });

      // Crypt Password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newPatient.password, salt, async(err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newPatient.password = hash;
            // Save user
            const patient = await newPatient.save()
            res.send({
                success_msg: "You are now registered and can log in",
                patient: patient
            });
        })
      );
    }
  }
});

router.get("/:name", async (req, res) => {
  const patientFound = await Patient.find({ name: req.params.name });
  res.send(patientFound);
});

// // Login Handle // '/dashboard is an example'
// router.post("/login", (req, res, next) => {
  router.post("/login", (req, res) => {
  passport.authenticate("local", {
    successRedirect: "https://bcmhealth.netlify.app/success",
    failureRedirect: "https://bcmhealth.netlify.app/login",
    //failureFlash: true,
  })(req, res);
  //})(req, res, next);
});

module.exports = router;
