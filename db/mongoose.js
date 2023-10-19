const mongoose = require('mongoose')

console.log('mongoose.js is running')
mongoose.connect('mongodb://127.0.0.1:27017/chatApp-api', {
    useNewUrlParser: true
})