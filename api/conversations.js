import { express } from "../Helpers_and_Prerequisites/libs_required.js"
//Conversation model
import { Conversation, conversationValidationSchema } from "../DB/Models/conversation.js"
import { Message, messageValidationSchema } from "../DB/Models/message.js"
import { User } from "../DB/Models/user.js"
const conversationRouter = express.Router();

// Joi schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true //remove unknown props
};

// Getting all users
conversationRouter.get("/", async (req, res) => {
    const conversations = await Conversation.find({}).populate("Messages");
    res.send(conversations);
  });

// conversationRouter is mounted at http://localhost:8080/conversations, anything after this is prefixed with this

conversationRouter.post('/new_conversation', async(req, res) => {
    let errors = [];
    try{ 
        const { error } = conversationValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { Sender, Receiver, Messages } = req.body
        const conversationCreated = await Conversation.create({Sender, Receiver, Messages})
        const senderFound = await User.findById(Sender)
        const receiverFound = await User.findById(Receiver)
        senderFound.conversations.push(conversationCreated._id)
        receiverFound.conversations.push(conversationCreated._id)
        await senderFound.save()
        await receiverFound.save()
        sendSuccess(res, "", conversationCreated)
    } catch (error) {
        res.send(error)
      }
})

conversationRouter.post('/:conversationId/new_message', async (req, res) => {
    let errors = [];
    try {
        const { error } = messageValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { Content, sender } = req.body
        const messageCreated = await Message.create({ Content, sender })
        const { conversationId } = req.params 
        const conversationFound = await Conversation.findById(conversationId)
        conversationFound.Messages.push(messageCreated)
        await conversationFound.save()
        sendSuccess(res, "", conversationFound)
    } catch (error) {
        res.send(error)
    }
    // Conversation.update(
    //     { _id: req.query.id },
    //     { $push: { conversation: req.body } },
    //     (err, data) => {
    //         if (err) {
    //             console.log('Error saving message...')
    //             console.log(err)

    //             res.status(500).send(err)
    //         } else {
    //             res.status(201).send(data)
    //         }
    //     }
    // )
})

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

conversationRouter.get('/get/conversation', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

conversationRouter.get('/get/lastMessage', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let convData = data[0].conversation

            convData.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(convData[0])
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