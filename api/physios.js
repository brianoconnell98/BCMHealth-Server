import {express, bcrypt } from "../Helpers_and_Prerequisites/libs_required.js"
//Physio Model
import {Physio, physioValidationSchema } from "../DB/Models/physio.js"
import passport from "passport"
const physioRouter = express.Router();

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true //remove unknown props
  };

  // App is mounted at http://localhost:8000/physios, anything after this is prefixed with this

  // Getting all physios
    physioRouter.get("/", async(req, res)=> {
    const physios = await Physio.find({});
    res.send(physios);
});

// Traversy Media https://www.youtube.com/watch?v=6FOq4cUdH8k
// Register Handle
physioRouter.post("/", async (req, res) => {

    let errors = [];
    try {
      const { error } = physioValidationSchema.validate(req.body, options);
      const { name: Name, email, location, password } = req.body,
      password2 = req.body.password2;
      const physioFound = await Physio.findOne({ email: email });
      if (physioFound) {
        // Physio exists
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
        const newPhysio = new Physio({
          name: Name,
          email,
          location,
          password,
        });
  
        // Crypt Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newPhysio.password, salt, async(err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newPhysio.password = hash;
              // Save user
              const physio = await newPhysio.save()
              res.send({
                  success_msg: "You are now registered and can log in",
                  physio: physio
              });
          })
        );
      }
    } catch (error) {
      console.log(error)
    }
  });
  
  
  physioRouter.get("/:name", async (req, res) => {
    const physioFound = await Physio.find({ name: req.params.name });
    res.send(physioFound);
  });
  
  physioRouter.get("/user", async (req, res) => {
    res.send(req.user);
  });
  
  // // Login Handle // '/dashboard is an example'
  // router.post("/login", (req, res, next) => {
    physioRouter.post("/login", (req, res, next) => {
    passport.authenticate("physio", {
      successRedirect: "https://bcmhealth.netlify.app/index.html",  // + sessionStorage.setItem('userId','1234')),
      failureRedirect: "https://bcmhealth.netlify.app/login",
    })(req, res, next);
  });
  
  export default physioRouter 