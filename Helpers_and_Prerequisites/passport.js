import { User } from "../DB/Models/user.js";
import { bcrypt, passportLocal } from "./libs_required.js";
const localStrategy = passportLocal.Strategy;

//Pasport Function To Export
const instantiate = async (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const userFound = await User.findOne({ email: email })
        if (!userFound)
          return done(null, false, {
            message: "No user found with that username",
          });
        try {
          const userMatch = await bcrypt.compare(password, userFound.password);
          if (userMatch) return done(null, userFound);
          else return done(null, false, { message: "Wrong Password" });
        } catch (error) {
          return error;
        }
      } catch (error) {
        return error;
      }
    })
  );
  passport.serializeUser((userNormal, done) => {
    try {
      return done(null, userNormal.id);
    } catch (error) {
      throw error;
    }
  });
  passport.deserializeUser(async (userId, done) => {
    try {
      const userFound = await User.findOne({ _id: userId });
      return done(null, userFound);
    } catch (error) {
      throw error;
    }
  });
};

export default instantiate

// //www.passport.org/docs/
//     //https://www.youtube.com/watch?v=6FOq4cUdH8k
//     import { passportLocal, bcrypt } from "./libs_required.js";
//     const LocalStrategy = passportLocal.Strategy;

//     // Load User Model // Load Physio Model
//     import { User } from "../DB/Models/user.js";

//     // // Nathaniel woodbury version of passport
//     const instantiate = function (passport) {
//     passport.use( new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//         User.findOne({ email: email }, (err, user) => {
//         if (err) throw err;
//         if (!user)
//             return done(null, false, {
//             message: "The email provided is not registered",
//             });
//         bcrypt.compare(password, user.password, (err, result) => {
//             if (err) throw err;
//             if (result === true) {
//             return done(null, user);
//             } else {
//             return done(null, false, { message: "The password is incorrect" });
//             }
//         });
//         }).catch((err) => console.log(err));
//     }))

//     //serialize User
//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser((id, done) => {
//         User.findById(id, (err, user) => {
//             done(err, user);
//         });
//     });
// }

//     export default instantiate
