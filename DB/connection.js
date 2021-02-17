// mongodb connection string from mongodb website
import {mongoose} from "../Helpers_and_Prerequisites/libs_required.js"
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

export default mongoose