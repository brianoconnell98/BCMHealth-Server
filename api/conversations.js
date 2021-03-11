import { express } from "../Helpers_and_Prerequisites/libs_required.js"
//Conversation model
import { Conversation, conversationValidationSchema } from "../DB/Models/conversation.js"
const conversationRouter = express.Router();

// Joi schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true //remove unknown props
};

// conversationRouter is mounted at http://localhost:8080/conversations, anything after this is prefixed with this

conversationRouter.post('/new_conversation', async(req, res) => {
    let errors = [];
    try{ 
        const { error } = conversationValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { receiverName, Sender, Receiver, conversation } = req.body
        const conversationCreated = await Conversation.create({receiverName, Sender, Receiver, conversation})
        sendSuccess(res, "", conversationCreated)
    } catch (error) {
        res.send(error)
      }
})

conversationRouter.post('/new/message', (req, res) => {
    mongoData.update(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('Error saving message...')
                console.log(err)

                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        }
    )
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