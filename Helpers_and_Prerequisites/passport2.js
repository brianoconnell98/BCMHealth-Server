// import { bcrypt, passportGoogle, passport } from "./libs_required.js";
// import { keys } from "./keys.js"

// // net ninja OAuth series of videos
// // https://www.youtube.com/playlist?list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x

// // passport for OAuth with google
// const googleOAuth = async (passport) => {
//     passport.use(
//     new passportGoogle({
//         // options for google strategy
//         callbackURL: '/auth/google/redirect',
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret
//     }, () => {
//         // passport callback function
//     })
//     )
//     };
    
//     export default googleOAuth