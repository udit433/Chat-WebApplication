const mongoose = require('mongoose')
// const Message = require('./messageModel')

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        // maxlength: 6,
        trim: true
    },
    Email: {
        type:String,
        required: true,
        unique: true
    },
    Phone:{
        type: String,
        required: true,
        unique: true
    },
    Token: {
        type: String
    },
    // Add later
    // Messages: {
    //     Friend: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User'
    //     },
    //     messageArr: [{
    //         message: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'Message'
    //         }    
    //     }]
    // },
    Friends: [{
        friend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    PendingRequests: [{
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    SentRequests: [{
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})


// const messageSchema = new mongoose.Schema({
//     Content: {
//         type: String,
//         required: true
//     },

//     Sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }, 

//     Receiver: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },

//     // Time: {

//     // }
// })

// const Message = mongoose.model('Message', messageSchema)
const User = mongoose.model('User', userSchema)

module.exports = {User}