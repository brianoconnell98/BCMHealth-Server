const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
router = express.Router(),
patient = require("../DB/Models/patient");

router.get("/", async(req, res)=>{
    const patients = await patient.find({})
    res.send(patients)
})

router.post("/", async(req, res)=>{
    const newPatient = {
        name: req.body.name,
        email: req.body.name,
        age: req.body.age
    };
    let createdPatient = await patient.create(newPatient)
    res.send(createdPatient)
})


module.exports = router