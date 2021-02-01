//https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66

mongoose = require("../connection")
physioSchema = mongoose.Schema({
        name: String,
        email: String,
        location: String,
    },
    { timestamps: true },
)
Physio = mongoose.model("Physio", physioSchema)

module.exports = Physio 