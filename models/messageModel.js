const mongoose = require('mongoose')
const User = require('./userModel')

const messageSchema = new mongoose.Schema({
    Room: {
        type: String,
        required: true
    },

    Content: {
        type: String,
        required: true
    },

    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 

    Receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Time: {

    // }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message