// const User = require('../models/userModel')
const Message = require('../models/messageModel')

const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected!!")

        socket.on('join', (room) => {
            socket.join(room)
            io.in(room).emit('joined', 'Joined Room: '+room)
        })

        socket.on("msgToServer", async ({currMsg, room, currId, friendId}) => {
            // console.log(room, currMsg)
            // const currUser = User.findById(currId), friendUser = User.findById(friendId)
            const sentMsg = new Message({Room: room, Content: currMsg, Sender: currId, Receiver: friendId})
            await sentMsg.save()
            // currUser.Messages[friendId].push(sentMsg._id)
            // friendUser.Messages[currId].push(sentmsg._id)
            console.log(room, currId, friendId)

            //save messages in messagemodel
            io.in(room).emit("msgToConnections", currMsg)
        })
    
        socket.on("disconnect", () => {
            console.log("user disconnected!!")
        })
    })
}

module.exports = socket