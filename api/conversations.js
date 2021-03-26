import { express } from "../Helpers_and_Prerequisites/libs_required.js"
// Importing models
import { Conversation, conversationValidationSchema } from "../DB/Models/conversation.js"
import { Message, messageValidationSchema } from "../DB/Models/message.js"
import { User } from "../DB/Models/user.js"
const conversationRouter = express.Router();

// Setting up variables for our different environment urls
const local_url = "http://localhost:5500/",
netlify_url = "https://bcmhealth.netlify.app/";

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true //remove unknown props
};


// conversationRouter is mounted at http://localhost:8080/conversations, anything after this is prefixed with this


// Code from Clever Programmer
// https://youtu.be/BKY0avHeda8
// https://youtu.be/OgOx6Y40-3s

// Getting all conversations
conversationRouter.get("/", async (req, res) => {
    const conversations = await Conversation.find({}).populate("Messages").populate("Sender").populate("Receiver");
    res.send(conversations);
});

// Getting single conversation messages by id
conversationRouter.get('/:id', async(req, res) => {
    let errors = [];
    try {
        // Error Handling
        req.params.id = req?.params?.id ?? errors.push({ msg: "Conversation Id is not valid" , redirectUrl: `${netlify_url}chatPortal.html` });
        if(errors.length > 0) res.status(500).send(errors);
        
        // Getting the id from the url route
        let conversation_id = req?.params?.id
        conversation_id = conversation_id?.trim();

        // Getting Messages by conversation id
        let conversation_found = await Conversation.findById(conversation_id);

        // Check if conversation Was Found 
        conversation_found = await conversation_found.populate("Messages").populate("Receiver").execPopulate() ??  errors.push({ msg: "Conversation Was not found with those credentials " , redirectUrl: `${netlify_url}chatPortal.html` });
        //const messages_found = conversation_found?.Messages ?? errors.push({ msg: "No messages could be found for this conversation" , redirectUrl: `${netlify_url}chatPortal.html` });
        if(errors.length > 0) res.status(404).send(errors);

        //Return conversation Found messages 
        res.status(200).send(conversation_found)
        
        
    } catch (error) {
        
    }
    
})

// New Conversation Route
conversationRouter.post('/new_conversation', async(req, res) => {
    let errors = [];
    try{ 
        const { error } = conversationValidationSchema.validate(req.body, options);
        if (error !== undefined) {
            errors.push(error)
            res.send(errors)
            return
        }
        const { Sender, Receiver, Messages } = req.body
        const senderFound = await User.findById(Sender)
        const receiverFound = await User.findById(Receiver)
        let conversationCreated = await Conversation.create({Sender, Receiver, Messages});
        senderFound.conversations.push(conversationCreated._id)
        receiverFound.conversations.push(conversationCreated._id)
        await senderFound.save()
        await receiverFound.save()
        conversationCreated = await conversationCreated.populate("Sender").populate("Receiver").populate("Messages").execPopulate()
        sendSuccess(res, "", conversationCreated)
    } catch (error) {
        res.send(error)
    }
})

// Post new message with conversationID in the url
conversationRouter.post('/:conversationId/new_message', async (req, res) => {
    let errors = [];
    try {
        const { error } = messageValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { Content, sender } = req.body
        const messageCreated = await Message.create({ Content, sender })
        const { conversationId } = req.params 
        let conversationFound = await Conversation.findById(conversationId)
        conversationFound.Messages.push(messageCreated)
        await conversationFound.save()
        conversationFound = await conversationFound.populate("Messages").execPopulate()
        sendSuccess(res, "", conversationFound)
    } catch (error) {
        res.send(error)
    }
})

// Code from Clever Programmer
// https://youtu.be/BKY0avHeda8
// https://youtu.be/OgOx6Y40-3s
conversationRouter.get('/get/conversationList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            let conversations = []

            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timestamp: conversationData.conversation[0].timestamp
                }

                conversations.push(conversationInfo)
            })

            res.status(200).send(conversations)
        }
    })
})


// General Helper Method to send Success message back to Client when Error occurs and redirect
const sendSuccess = (res, successMsg, createdUser, redirectUrl) => {
    res.send({
        success_msg: successMsg,
        user: createdUser,
        redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
    })
}

export default conversationRouter 