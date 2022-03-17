const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/Jan-SW", {
    useNewUrlParser: true
});

const personSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 110
    },
    jobTitle: {
        type: String,
        required: true,
        minlength: 2
    },
    hobbies: {
        type: [String]
    }
});

module.exports = mongoose.model("Person", personSchema);