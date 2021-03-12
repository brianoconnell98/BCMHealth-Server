import mongoose from '../connection.js'
import {Joi} from '../../Helpers_and_Prerequisites/libs_required.js'

// declaring Schema for validation
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: String,
    age: String,
    userType: String,
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }]
}, {timestamps: true}),

// JOI documentation for error handling for schemas - https://www.youtube.com/watch?v=PwUoiTt2oKM&ab_channel=NoobCoder&fbclid=IwAR1FlAFIDWyItHSy9aSgFyGrWd9zGXgjQuL3wby1WWR27guh5okMXxERPxM
userValidationSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email : Joi.string().trim().email().required(),
    password : Joi.string().trim().min(4).max(20).required(),
    location : Joi.string().trim(),
    age : Joi.string().trim(),
    userType : Joi.string().trim().required(),
    conversations : Joi.array().required()
});

const User = mongoose.model('User', userSchema);

export { User, userValidationSchema }