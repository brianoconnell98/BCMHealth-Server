import { session, cors, express, passport, cookieParser } from "./Helpers_and_Prerequisites/libs_required.js";
const app = express();
const port = process.env.PORT || 8000;
import userRouter from "./api/users.js";
import conversationRouter from "./api/conversations.js";
import authRouter from "./api/auth-routes.js";
import { keys } from "./Helpers_and_Prerequisites/keys.js";

// Passport config
import passportInitialize from "./Helpers_and_Prerequisites/passport.js"

//--------------------------------------------- Middleware ----------------------------------------------

// Cookie Parser https://www.youtube.com/watch?v=IUw_TgRhTBE&ab_channel=NathanielWoodbury&fbclid=IwAR2zsQHInNxkAsUCLiyxlzIDFBm5eocorsPulPYUBxfdQ0H3CuUNmMry2HY
app.use(cookieParser("secretcode"))

// Express-Session https://www.youtube.com/watch?v=6FOq4cUdH8k
app.use(session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie : {
        maxAge:(1000 * 60 * 60*24),
        keys: [keys.session.cookieKey]
        }
}));

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


// Routes
app.get("/", (req, res) =>{
    res.json({
        message: "Hello World!"
    })
})

app.use("/users", userRouter)
app.use("/conversations", conversationRouter)
app.use("/auth-routes", authRouter)
app.post("/:name", (req, res) =>{
    res.json({
        message: `Well from ${req.params.name}, ${req.params.email}, ${req.body.age}`
    })
})


// Start Server
app.listen(port, () =>{
    console.log(`Your server seems to have started on ${port}`)
})