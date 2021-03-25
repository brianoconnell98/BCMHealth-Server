import { express } from "../Helpers_and_Prerequisites/libs_required.js";

import passport from "passport";
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
authRouter.get("/login", (req, res) => {
res.json({
    message: "Google Login Route!",
});
});

// logging out
authRouter.get("/logout", (req, res) => {
  // handle with passport
res.json({
    message: "Google OAuth logging out!",
});
});

// auth with google
authRouter.get("/google",
passport.authenticate("google", {
    scope: ["profile"],
})
);

// callback route for google to redirect to
authRouter.get("/google/redirect",
passport.authenticate("google"),
(req, res) => {
//res.send(req.user);
res.json({
    message: "Google OAuth redirecting as you have signed in!",
});
}
);

// // Login Handle
authRouter.post("/login", async (req, res, next) => {
try {
// Declaring array to carry my errors
let errors = [];
passport.authenticate("google", (err, userNormal, info) => {
    if (err) errors.push(err) && sendError(res, errors);
    if (info != undefined && info.message)
    errors.push(info.message) && sendError(res, errors);
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

export default authRouter;
