const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
router = express.Router(),
physio = require("../DB/Models/physio");

router.get("/", async(req, res)=>{
    const physios = await physio.find({})
    res.send(physios)
});

router.post("/", async(req, res)=>{
    const newPhysio = {
        name: req.body.name,
        email: req.body.email,
        location: req.body.location
    };
    let createdPhysio = await physio.create(newPhysio)
    res.send(createdPhysio)
});


module.exports = router;