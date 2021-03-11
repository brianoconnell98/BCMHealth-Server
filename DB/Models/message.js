import mongoose from "../connection.js";
import { Joi } from "../../Helpers_and_Prerequisites/libs_required.js";

const messageSchema = mongoose.Schema({
    Content: String,
    timestamp: String,
    user: {
        displayName: String,
        userId: String,
    },
}),
  // JOI documentation for error handling for schemas - https://www.youtube.com/watch?v=PwUoiTt2oKM&ab_channel=NoobCoder&fbclid=IwAR1FlAFIDWyItHSy9aSgFyGrWd9zGXgjQuL3wby1WWR27guh5okMXxERPxM
messageValidationSchema = Joi.object().keys({
    Content: Joi.string().trim().required(),
    timestamp: Joi.string().trim().required(),
    user: Joi.object().keys({
        displayName: Joi.string().trim().required(),
        userId: Joi.string().trim().required(),
    })
});

const Message = mongoose.model("Message", messageSchema);

export { Message, messageValidationSchema };
