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