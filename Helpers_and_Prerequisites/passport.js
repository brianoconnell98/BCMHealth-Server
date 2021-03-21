import { User } from "../DB/Models/user.js";
import { bcrypt, passportLocal, passportGoogle, passport } from "./libs_required.js";
import { keys } from "./keys.js";

const localStrategy = passportLocal.Strategy;
const googleStrategy = passportGoogle.Strategy;
// const keys = require('./keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

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


  // .then = await+async?
  // OAuth for google
  passport.use(
    new googleStrategy({
        // options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // Check if user already exists in the db
        User.findOne({googleId: profile.id}).then((currentUser) => {
          if(currentUser){
            // already have the user
            console.log('user is: ', + currentUser);
            done(null, currentUser);
          } else {
            // if not create new user in the db
            new User({
              Name: profile.displayName,
              googleId: profile.id
            }).save().then((newUser) => {
              console.log('New user created: ' + newUser);
              done(null, newUser);
            });
          }
        });

        
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
};

export default instantiate
