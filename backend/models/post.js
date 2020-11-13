const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    status: { type: String, required: true },
    flightCode: { type: String, required: true },
    flightProvider: { type: String, required: true },
    source: { type: String, required: true },
    sourceCode: { type: String, required: true },
    destination: { type: String, required: true },
    destinationCode: { type: String, required: true },
    arrivalDate: { type: String, required: true },
    departureDate: { type: String, required: true },
    arrivalTime: { type: String, required: true }
});

module.exports = mongoose.model("Post", postSchema);