console.log('running client.js')

const socket = io()
// const room = 'room1'

console.log(room, currId, friendId)
const msgInput = document.getElementById('msg')
const msgPage = document.getElementById('msgPage')

function sendMsg(){
    const currMsg = msgInput.value
    socket.emit("msgToServer", {currMsg, room, currId, friendId})
    
    msgInput.value = ''
}

socket.emit('join', room)

socket.on('joined', (msg) => {
    msgPage.innerHTML += "<p>" + msg + "</p>"
})

socket.on("msgToConnections", (msg)=>{
    msgPage.innerHTML = "<p>" + msg + "</p>" + msgPage.innerHTML
    console.log(msg)
})

