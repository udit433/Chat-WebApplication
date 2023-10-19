const express = require('express')
const auth = require('../middleware/auth')
const path = require('path')
const {User} = require('../models/userModel')
const Message = require('../models/messageModel')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('main', {layout: 'index'})
})

router.get('/home', auth, async (req, res) => {
    // console.log(req.headers.cookie)
    const friends = []
    const currUser = req.user
    for(var i in currUser.Friends){
        const user = await User.findById(currUser.Friends[i]._id)
        const id = user._id, name = user.Name, email = user.Email
        friends.push({id, name, email})
    }
    res.render('main', {layout: 'homePage', friends})
})

router.get('/search', auth, async (req, res) => {
    res.render('main', {layout: 'searchPage'})
})

router.get('/pending-requests', auth, async (req, res) => {
    // make name and email arr and pass to page
    var arr = []
    const requests = req.user.PendingRequests
    for(i in requests){
        const user = await User.findById(requests[i]._id), name = user.Name, email = user.Email, id = user._id
        arr.push({id,name, email})
    }
    res.render('main', {layout: 'pendingRequestsPage', arr})
})

router.get('/chat', auth, async(req, res) => {
    res.render('main', {layout: 'chatPage'})
})

router.get('/chat/:id', auth, async(req, res) => {
    try{
        const name = req.user.Name

        const friendId = req.params.id, currId = req.user._id
        var room = ''
        
        const friendUser = await User.findById(friendId), currUser = req.user
        const friendIdStr = friendId.toString()
        const currIdStr = currId.toString()
        
        if(currIdStr < friendIdStr){
            room += (currIdStr+friendIdStr)
        }
        else{
            room += (friendIdStr+currIdStr)
        }
        
        const messageArr = await Message.find({Room: room}), messageContentArr = []
        for(i in messageArr){
            messageContentArr.push(messageArr[i].Content)
        }
        // console.log(messageContentArr)

        res.render('main', {layout: 'chatPage', room, currUserName: currUser.Name, friendUserName: friendUser.Name, currId, friendId, messageContentArr})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/accept-request/:id', auth, async(req, res) => {
    try{
        const requestUser = await User.findById(req.params.id)
        const currUser = req.user
        currUser.Friends.push(requestUser._id)
        requestUser.Friends.push(currUser._id)
        
        // remove from currUser pending and requestedUser sent requests
        currUser.PendingRequests = currUser.PendingRequests.filter((request) => {
            return !request._id.equals(requestUser._id)
        })
        requestUser.SentRequests = requestUser.SentRequests.filter((request) => {
            return !request._id.equals(currUser._id)
        })

        await currUser.save()
        await requestUser.save()
        res.redirect('/pending-requests')
    }
    catch(err){
        console.log(err)
    }
})

router.post('/decline-request/:id', auth, async(req, res) => {
    try{
        const requestUser = await User.findById(req.params.id)
        const currUser = req.user
        
        // remove from currUser pending and requestedUser sent requests
        currUser.PendingRequests = currUser.PendingRequests.filter((request) => {
            return !request._id.equals(requestUser._id)
        })
        requestUser.SentRequests = requestUser.SentRequests.filter((request) => {
            return !request._id.equals(currUser._id)
        })

        await currUser.save()
        await requestUser.save()
        res.redirect('/pending-requests')
    }
    catch(err){
        console.log(err)
    }
})


module.exports = router