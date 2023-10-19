const express = require('express')
const jwt = require('jsonwebtoken')
const {User} = require('../models/userModel')
const Message = require('../models/messageModel')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/users/login', (req,res) => {
    res.render('main', {layout: 'loginPage'})
})

router.get('/users/signup', (req,res) => {
    res.render('main', {layout: 'signupPage'})
})

router.get('/account/:id', auth, async(req, res) => {
    try{
        const id = req.params.id
        const searchedUser = await User.findById(id)
        const currUser = req.user
        var isFriend = false, isRequestSent = false, isRequestReceived = false
        for(var friendId in currUser.Friends){
            if(currUser.Friends[friendId]._id.equals(searchedUser._id))
                isFriend = true
        }
        for(var requestedUserId in currUser.SentRequests){
            if(currUser.SentRequests[requestedUserId]._id.equals(searchedUser._id))
                isRequestSent = true
        }
        for(var requestedUserId in currUser.PendingRequests){
            if(currUser.PendingRequests[requestedUserId]._id.equals(searchedUser._id))
                isRequestReceived = true
        }
        res.render('main', {layout: 'accountPage', id, name: searchedUser.Name, email: searchedUser.Email, phone: searchedUser.Phone, friends: searchedUser.Friends, isFriend, isRequestSent, isRequestReceived})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/users/login', async (req, res) => {
    const email = req.body.email
    const pswd = req.body.password

    if(!email || !pswd){
        res.render('main', {layout: 'loginPage', note: 'Enter both Email and Password fields...'})
    }
    else{
        try{
            const user = await User.findOne({Email: email})
            // console.log(user)
            if(user && user.Password === pswd){
                const token = jwt.sign({id: user._id}, 'thisIsCool')
                user.Token = token
                await user.save()
                res.cookie('token', token)
                res.redirect('/home')
            }
            else{
                res.render('main', {layout: 'loginPage', note: 'Check Email and Password'})
            }
        }
        catch(err){
            console.log(err)
        }
    }
})

router.post('/users/signup', async (req,res) => {
    const {name, email, phone, password} = req.body

    if(!name || !email || !password || !phone){
        res.render('main', {layout: 'signupPage', note: 'Enter all the fields...'})
    }
    else{
        const user = new User()
        user.Name = name
        user.Email = email
        user.Phone = phone
        user.Password = password
        const token = jwt.sign({id: user._id}, 'thisIsCool')
        user.Token = token
        try{
            await user.save()
            res.cookie('token', token)
            res.redirect('/home')
        }
        catch(err){
            res.render('main', {layout: 'signupPage', note: 'Email or Phone already in use...'})
        }
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        const user = req.user
        user.Token = null
        await user.save()
        res.clearCookie('token')
        res.redirect('/')
    }
    catch(err){
        console.log(err)
    }
})

router.post('/search', auth, async(req, res) => {
    try{
        const email = req.body.searchInput
        const searchUser = await User.findOne({Email: email})
        const id = searchUser._id
        res.redirect('/account/' + id)
    }
    catch(err){
        // Enter a valid Email...
        res.render('main', {layout: 'accountPage', note: 'Enter a valid Email...'})
    }
})

router.post('/send_request/:id', auth, async(req, res) => {
    // console.log('request received...')
    const currUser = req.user
    const id = req.params.id
    const requestedUser = await User.findById(id)
    currUser.SentRequests.push(id)
    requestedUser.PendingRequests.push(currUser._id)
    await currUser.save()
    await requestedUser.save()
    res.redirect('/account/'+id)
})

module.exports = router