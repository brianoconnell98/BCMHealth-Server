//https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66

// mongoose = require("../connection")
// patientSchema = mongoose.Schema({
//         name: String,
//         email: String,
//         age: Number,
//     },
//     { timestamps: true },
// )
// Patient = mongoose.model("Patient", patientSchema)

// module.exports = Patient

//https://www.youtube.com/watch?v=6FOq4cUdH8k

import mongoose from '../connection.js'
import {Joi} from '../../Helpers_and_Prerequisites/libs_required.js'

// declaring Schema for validation
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
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
patientValidationSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email : Joi.string().trim().email().required(),
    age : Joi.string().trim().min(0).max(3).required(),
    password : Joi.string().trim().min(4).max(20).required()
});

const Patient = mongoose.model('Patient', patientSchema);

export { Patient, patientValidationSchema }