const express = require("./Helpers_and_Prerequisites/libs_required"),
app = express(),
port = process.env.PORT || 8000;
patientsRouter = require("./api/patients")
physiosRouter = require("./api/physios")

// https://www.youtube.com/watch?v=6FOq4cUdH8k
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport config
require('./Helpers_and_Prerequisites/passport')(passport);

// Bodyparser https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(express.urlencoded({ extended: false }));

// Express-Session https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(passport.initialize());
app.use(passport.session());

// Connect flash https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(flash());

// Global Variables https://www.youtube.com/watch?v=6FOq4cUdH8k
//messages.ejs 1:16:39
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.json())

//Permit transferring of data from one server to the other 
//Adam O Ceallaigh explained as to how to download this add on
app.use(cors())

app.get("/", (req, res) =>{
    res.json({
        message: "Hello World!"
    })
})

app.use("/patients", patientsRouter)
app.post("/:name", (req, res) =>{
    res.json({
        message: `Well from ${req.params.name}, ${req.params.email}, ${req.body.age}`
    })
})

app.use("/physios", physiosRouter)
app.post("/:name", (req, res) =>{
    res.json({
        message: `Well from ${req.params.name}, ${req.params.email}, ${req.body.age}`
    })
})

app.listen(port, () =>{
    console.log(`Your server seems to have started on ${port}`)
})