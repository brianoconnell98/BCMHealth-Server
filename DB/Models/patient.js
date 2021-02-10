//https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66

mongoose = require("../connection")
patientSchema = mongoose.Schema({
        name: String,
        email: String,
        age: Number,
    },
    { timestamps: true },
)
Patient = mongoose.model("Patient", patientSchema)

module.exports = Patient

//https://www.youtube.com/watch?v=6FOq4cUdH8k

// const mongoose = require('../connection');

// const patientSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Patient = mongoose.model('Patient', patientSchema);

// module.exports = Patient;