import { session, cors, express, passport, cookieParser, bcrypt } from "./Helpers_and_Prerequisites/libs_required.js";
const app = express();
const port = process.env.PORT || 8000;
import patientRouter from "./api/patients.js";
import physioRouter from "./api/physios.js";
import conversationRouter from "./api/conversations.js";

// Passport config
import passportInitialize from "./Helpers_and_Prerequisites/passport.js"

//--------------------------------------------- Middleware ----------------------------------------------

// Passport https://www.youtube.com/watch?v=6FOq4cUdH8k / https://www.youtube.com/watch?v=IUw_TgRhTBE&ab_channel=NathanielWoodbury&fbclid=IwAR2zsQHInNxkAsUCLiyxlzIDFBm5eocorsPulPYUBxfdQ0H3CuUNmMry2HY
app.use(passport.initialize());
app.use(passport.session());
passportInitialize(passport)

// Global Variables https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use((req, res, next) =>{
    next();
});

// Middleware
// https://stackoverflow.com/questions/47232187/express-json-vs-bodyparser-json
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//Permit transferring of data from one server to the other 
//Adam O Ceallaigh explained as to how to download this add on
// why does he open up a function and give a url? + credentials= 'true' 8:46 first video
app.use(cors())

// Cookie Parser https://www.youtube.com/watch?v=IUw_TgRhTBE&ab_channel=NathanielWoodbury&fbclid=IwAR2zsQHInNxkAsUCLiyxlzIDFBm5eocorsPulPYUBxfdQ0H3CuUNmMry2HY
app.use(cookieParser("secretcode"))

// Express-Session https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie : {
        maxAge:(1000 * 60 * 100)
        }
}));


// Routes
app.get("/", (req, res) =>{
    res.json({
        message: "Hello World!"
    })
})

app.use("/patients", patientRouter)
app.use("/physios", physioRouter)
app.use("/conversations", conversationRouter)
app.post("/:name", (req, res) =>{
    res.json({
        message: `Well from ${req.params.name}, ${req.params.email}, ${req.body.age}`
    })
})


// Start Server
app.listen(port, () =>{
    console.log(`Your server seems to have started on ${port}`)
})