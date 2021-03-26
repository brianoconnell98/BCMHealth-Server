import { User } from "../DB/Models/user.js";
import { bcrypt, passportLocal, passportGoogle, passport } from "./libs_required.js";
import { keys } from "./keys.js";

const localStrategy = passportLocal.Strategy;
const googleStrategy = passportGoogle.Strategy;

const local_server_url = "http://localhost:8000/",
local_client_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/",
heroku_url = "https://bcmhealthserver.herokuapp.com/";

// Passport for User
//Passport Function To Export
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
  )

  // Net ninja OAuth videos commented in readme file
  // strategy for google OAuth
  passport.use(
    new googleStrategy({
      // options for google strategy
      callbackURL: `https://bcmhealth.netlify.app/support.html`,
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
  }, async (accessToken, refreshToken, profile, done) => {
      // try {
        const userFound = await User.findOne({ googleId: profile.id })
        if (userFound) {
        console.log('user is: ', + userFound);
        return done(null, userFound);
      } else {
            // if not create new user in the db
            new User({
              name: profile.displayName,
              googleId: profile.id
            }).save().then((newUser) => {
              console.log('New user created: ' + newUser);
              done(null, newUser);
            });
          }
      // catch (error) {
      //   return error;
      // }
    })
  )


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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};

export default instantiate


// Manipulation of tutorial code and my other passport code 

  // // .then = await+async?
  // // OAuth for google
  // passport.use(
    // new googleStrategy({
        // options for google strategy
        // callbackURL: '/auth-routes/google/redirect',
        // clientID: keys.google.clientID,
        // clientSecret: keys.google.clientSecret
    // }, (accessToken, refreshToken, profile, done) => {
        //// passport callback function
        //// Check if user already exists in the db
        // console.log('passport callback function fired')
        // console.log(profile)
        // User.findOne({googleId: profile.id}).then((currentUser) => {
        //   if(currentUser){
        //     // already have the user
        //     console.log('user is: ', + currentUser);
        //     done(null, currentUser);
        //   } else {
        //     // if not create new user in the db
        //     new User({
        //       Name: profile.displayName,
        //       googleId: profile.id
        //     }).save().then((newUser) => {
        //       console.log('New user created: ' + newUser);
        //       done(null, newUser);
        //     });
        //   }
        // });
  //   })
  // )                 

// // .then = await+async?
//   // OAuth for google
//   passport.use(
//     new googleStrategy({
//         // options for google strategy
//         callbackURL: '/auth/google/redirect',
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret
//     }, async (accessToken, refreshToken, profile, done) => {
//         // passport callback function
//         // Check if user already exists in the db
//           const googleUserFound = await User.findOne({googleId: profile.id})
//           if (!googleUserFound)
//           return done(null, false, {
//             message: "No user found with that username",
//           })
//           else if (goolgeUserMatch) 
//           // already have the user
//           return done(null, googleUserMatch);
//           console.log('user is: ', + googleUserMatch);
//         } else {
//             // if not create new user in the db
//             new User({
//               Name: profile.displayName,
//               googleId: profile.id
//             }).save().then((newUser) => {
//               console.log('New user created: ' + newUser);
//               done(null, newUser);
//             });
//       })
//     )

    // User.findOne({googleId: profile.id}).then((currentUser) => {
        //   if(currentUser){
        //     // already have the user
        //     console.log('user is: ', + currentUser);
        //     done(null, currentUser);
        //   } else {
        //     // if not create new user in the db
        //     new User({
        //       Name: profile.displayName,
        //       googleId: profile.id
        //     }).save().then((newUser) => {
        //       console.log('New user created: ' + newUser);
        //       done(null, newUser);
        //     });
        //   }
        // });