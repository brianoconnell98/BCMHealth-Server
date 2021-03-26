import { express, bcrypt } from "../Helpers_and_Prerequisites/libs_required.js";
//User model
import { User, userValidationSchema } from "../DB/Models/user.js";

// General Global Variables 
import passport from "passport";
const userRouter = express.Router(),
local_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/";


// Joi schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, //remove unknown props
};

// App is mounted at http://localhost:8080/users, anything after this is prefixed with this

// Getting all users
userRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

// Getting all users
userRouter.get("/:id", async (req, res) => {
  const userFound = await User.findById(req.params.id);
  res.send(userFound);
});

// Traversy Media https://www.youtube.com/watch?v=6FOq4cUdH8k
// Register Handle
userRouter.post("/", async (req, res) => {
  let errors = [];
  try {
    const { error } = userValidationSchema.validate(req.body, options);
    const { name: Name, email, password, age, location, userType } = req.body,
      password2 = req.body.password2;
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      // User exists
      errors.push({ msg: "Email is already registered", redirectUrl: `${local_url}login.html` });
      res.status(500).send(errors);
      return;
    }
    // Check passwords match
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" , redirectUrl: `${local_url}register.html` });
      res.status(500).send(errors);
      return;
    }
    if (error) errors.push(error) && sendError(res, errors);
    else {
      const newUser = new User({
        name: Name,
        email,
        password,
        age,
        location,
        userType,
      });

      // Crypt Password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          // Set password to hashed
          newUser.password = hash;
          // Save user
          const user = await newUser.save();
          res.status(200).send({
            success_msg: "You are now registered and can log in",
            user: user,
            redirectUrl : `${local_url}support.html`
          });
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/:name", async (req, res) => {
  const userFound = await User.find({ name: req.params.name });
  res.send(userFound);
});

userRouter.get("/user", async (req, res) => {
  res.send(req.user);
});

userRouter.post("/login", async (req, res, next) => {
  try {
    // Declaring array to carry my errors
    let errors = [];
    passport.authenticate("local", (err, userNormal, info) => {
      if (err) errors.push(err) && sendError(res, errors);
      if (info != undefined && info.message)
        errors.push(info.message) && sendError(res, errors);
      if (!userNormal) {
        errors.push("No User exists with these credentials");
        sendError(res, errors);
        return;
      }
      req.logIn(userNormal, (err) => {
        if (err) return sendError(res, err);
        req.session.save(() => {
          req.session.user = req.user;
          sendSuccess(
            res,
            "You are now successfully logged in",
            req.user,
            `${local_url}support.html`
          );
        });
      });
    })(req, res, next);
  } catch (errorMsg) {
    sendError(res, errorMsg);
  }
});

// // // Login Handle
//   userRouter.post("/login", (req, res, next) => {
//       console.log(req.user)
//   passport.authenticate("local", {
//     successRedirect: "https://bcmhealth.netlify.app/support.html?loggedIn=true",
//     failureRedirect: "https://bcmhealth.netlify.app/login",
//   })(req, res, next);
// });

// General Helper Method to send Error message back to Client when Error occurs and redirect
const sendError = (res, errorMsg, redirectUrl) => {
  res.send({
    message: "An error has occurred",
    cause: errorMsg,
    status: errorMsg.status,
    redirectUrl:
      redirectUrl != null || redirectUrl != undefined ? redirectUrl : "",
  });
};

// General Helper Method to send success message back to Client when Error occurs and redirect
const sendSuccess = (res, successMsg, createdUser, redirectUrl) => {
    res.send({
    success_msg: successMsg,
    user: createdUser,
    redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
    })
    }

export default userRouter;
