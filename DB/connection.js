import {mongoose, Pusher} from "../Helpers_and_Prerequisites/libs_required.js"
import { keys } from "../Helpers_and_Prerequisites/keys.js"

// Clever Programmer
// https://youtu.be/BKY0avHeda8
// https://youtu.be/OgOx6Y40-3s

// Pusher code from pusher.com
//Pusher Config
const pusher = new Pusher({
    appId: "1170624",
    key: "b992bcb8d175d75ddf36",
    secret: "7c88557cbca85bdc39ca",
    cluster: "eu",
    useTLS: true
});

// mongodb connection string from mongodb website
mongoose.connect(keys.mongoDb.dbURI ,{
    useFindAndModify: false, 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("DB connected succesfully")
}).catch((err)=> {
    console.log(err)
})

// Clever Programmer
// https://youtu.be/BKY0avHeda8
// https://youtu.be/OgOx6Y40-3s
mongoose.connection.once('open', () => {
    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('conversations', 'newConversation', {
                'change': change
            })
            console.log('Pusher Watching')
        } else if (change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
            })
            console.log('Message Change');
        } else {
            console.log('Error triggering Pusher...')
        }
    })
})

export default mongoose