// const { Router } = require("../Helpers_and_Prerequisites/libs_required");

import { express, bcrypt } from "../Helpers_and_Prerequisites/libs_required.js"
//Patient model
import { Patient, patientValidationSchema } from "../DB/Models/patient.js"
import passport from "passport"
const patientRouter = express.Router();

// Joi schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true //remove unknown props
};

// App is mounted at http://localhost:8080/patients, anything after this is prefixed with this

// Notes for Adam
// 13 mins into video from nathaniel woodbury - state - import from react to hold values throughout application.
// Also the axios are put in the app.js file with the input fields this is the front end for him.
// Can i implement that into my project?

// Getting all patients
patientRouter.get("/", async (req, res) => {
  const patients = await Patient.find({});
  res.send(patients);
});

// Traversy Media https://www.youtube.com/watch?v=6FOq4cUdH8k
// Register Handle
patientRouter.post("/", async (req, res) => {

  let errors = [];
  try {
    const { error } = patientValidationSchema.validate(req.body, options);
    const { name: Name, email, age, password } = req.body,
    password2 = req.body.password2;
    const patientFound = await Patient.findOne({ email: email });
    if (patientFound) {
      // Patient exists
      errors.push({ msg: "Email is already registered" });
      res.send(res, errors);
      return
    } 
      // Check passwords match
      if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
      res.send(res, errors);
      return
  }
    if (error) errors.push(error) && sendError(res, errors);
    else {
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
  } catch (error) {
    console.log(error)
  }
});


patientRouter.get("/:name", async (req, res) => {
  const patientFound = await Patient.find({ name: req.params.name });
  res.send(patientFound);
});

// // Login Handle // '/dashboard is an example'
// router.post("/login", (req, res, next) => {
  patientRouter.post("/login", (req, res) => {
  passport.authenticate("local", {
    successRedirect: "https://bcmhealth.netlify.app/success",
    failureRedirect: "https://bcmhealth.netlify.app/login",
  })(req, res);
});

export default patientRouter 
