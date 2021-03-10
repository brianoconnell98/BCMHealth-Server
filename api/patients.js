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

// Getting all patients
patientRouter.get("/", async (req, res) => {
  const patients = await Patient.find({});
  res.send(patients);
});

//Nathaniel Woodbury Passport video
patientRouter.post("/nathan", (req, res) => {
  Patient.findOne({email: req.body.email}, async (err,doc) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newPatient = new Patient({
        Name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: hashedPassword,  
      });
      await newPatient.save();
      res.send("Patient Created")
    }
  })
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

patientRouter.get("/user", async (req, res) => {
  res.send(req.user);
});

// // Login Handle 
  patientRouter.post("/login", (req, res, next) => {
  passport.authenticate("patient", {
    successRedirect: "https://bcmhealth.netlify.app/support.html?loggedIn=true",
    failureRedirect: "https://bcmhealth.netlify.app/login",
  })(req, res, next);
});

export default patientRouter 
