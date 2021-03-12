import mongoose from '../connection.js'
import {Joi} from '../../Helpers_and_Prerequisites/libs_required.js'

const conversationSchema = mongoose.Schema({
    Sender: String,
    Receiver: String,
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
        }]
}),

// JOI documentation for error handling for schemas - https://www.youtube.com/watch?v=PwUoiTt2oKM&ab_channel=NoobCoder&fbclid=IwAR1FlAFIDWyItHSy9aSgFyGrWd9zGXgjQuL3wby1WWR27guh5okMXxERPxM
conversationValidationSchema = Joi.object().keys({
    Sender: Joi.string().trim().required(),
    Receiver: Joi.string().trim().required(),
    Messages: Joi.array().items()
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation, conversationValidationSchema }