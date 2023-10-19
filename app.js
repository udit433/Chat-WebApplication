const express = require("express")
const path = require('path')
const {createServer} = require("http")
const socket = require("socket.io")
require('./db/mongoose.js')
const handlebars = require('express-handlebars')
const socketRouter = require('./routers/socketRouter')
const chatRouter = require('./routers/chatRouter')
const userRouter = require('./routers/userRouter')

const app = express()
const httpServer = createServer(app)
const io = new socket.Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')))

app.use(chatRouter)
app.use(userRouter)

app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}))

socketRouter(io)

// io.on("connection", (socket) => {
//     console.log("a user connected!!")

//     socket.on("msgToServer", (msg) => {
//         io.emit("msgToConnections", msg)
//     })

//     socket.on("disconnect", () => {
//         console.log("user disconnected!!")
//     })
// })

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})