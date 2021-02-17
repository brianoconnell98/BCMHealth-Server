//const { Router } = require("../Helpers_and_Prerequisites/libs_required");
import {express} from "../Helpers_and_Prerequisites/libs_required.js"
const physioRouter = express.Router()
import {physio} from "../DB/Models/physio.js";

physioRouter.get("/", async(req, res)=>{
    const physios = await physio.find({})
    res.send(physios)
});

physioRouter.post("/", async(req, res)=>{
    const newPhysio = {
        name: req.body.name,
        email: req.body.email,
        location: req.body.location
    };
    let createdPhysio = await physio.create(newPhysio)
    res.send(createdPhysio)
});


export default physioRouter