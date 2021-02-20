//https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66

// const mongoose = require("../connection")
// physioSchema = mongoose.Schema({
//         name: String,
//         email: String,
//         location: String,
//     },
//     { timestamps: true },
// ),
// Physio = mongoose.model("Physio", physioSchema)

// export default Physio 

import mongoose from '../connection.js'
import {Joi} from '../../Helpers_and_Prerequisites/libs_required.js'

// declaring Schema for validation
const physioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}),

// JOI documentation for error handling for schemas - https://www.youtube.com/watch?v=PwUoiTt2oKM&ab_channel=NoobCoder&fbclid=IwAR1FlAFIDWyItHSy9aSgFyGrWd9zGXgjQuL3wby1WWR27guh5okMXxERPxM
physioValidationSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email : Joi.string().trim().email().required(),
    location : Joi.string().trim().required(),
    password : Joi.string().trim().min(4).max(20).required()
});

const Physio = mongoose.model('Physio', physioSchema);

export { Physio, physioValidationSchema }