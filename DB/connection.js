// mongodb connection string from mongodb website
import {mongoose, Pusher} from "../Helpers_and_Prerequisites/libs_required.js"

//Pusher Config
const pusher = new Pusher({
    appId: "1170624",
    key: "b992bcb8d175d75ddf36",
    secret: "7c88557cbca85bdc39ca",
    cluster: "eu",
    useTLS: true
  });

mongoose.connect("mongodb+srv://BrianOConnell:fypproject@bcmhealth.5zklp.mongodb.net/bcmhealth?retryWrites=true&w=majority",{
    useFindAndModify: false, 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("DB connected succesfully")
}).catch((err)=> {
    console.log(err)
})

mongoose.connection.once('open', () => {
    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if (change.operationType === 'update') {
            // pusher.trigger('messages', 'newMessage', {
            //     'change': change
            // })
            pusher.trigger("my-channel", "my-event", {
                message: "hello world"
            });
        } else {
            console.log('Error triggering Pusher...')
        }
    })
})

export default mongoose