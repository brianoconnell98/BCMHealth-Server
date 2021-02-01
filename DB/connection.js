// mongodb connection string from mongodb website
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

module.exports = mongoose