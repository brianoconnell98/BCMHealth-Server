import { express, passport } from "../Helpers_and_Prerequisites/libs_required.js"

const authRouter = express.Router(),
local_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/";

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, //remove unknown props
};

// authRouter is mounted at http://localhost:5500/auth, anything after this is prefixed with this

// auth login
authRouter.get('/login', (req, res) => {
    res.json({
        message: "Google Login Route!"
    })
});

// logging out
authRouter.get('/logout', (req, res) => {
    // handle with passport
    res.json({
        message: "Google OAuth logging out!"
    })
});

// testing one below
authRouter.get('/google', (req, res) => {
    res.json({
        message: "Google Route!"
    })
});

//auth with google
// authRouter.get('/google', passport.authenticate('google', {
//     scope: ['profile']
// }));

// callback route for google to redirect to
authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});


export default authRouter