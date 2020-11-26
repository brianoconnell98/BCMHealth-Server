const express = require("./Helpers_and_Prerequisites/libs_required"),
app = express(),
port = process.env.PORT || 8000;
patientsRouter = require("./api/patients")
physiosRouter = require("./api/physios")

app.use(express.json())

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