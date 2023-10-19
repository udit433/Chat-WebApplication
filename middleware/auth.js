const jwt = require('jsonwebtoken')
const {User} = require('../models/userModel')

const auth = async (req, res, next) => {
    try{
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.headers.cookie.substring(6)
        // console.log(token)
        const id = await jwt.verify(token, 'thisIsCool').id
        const user = await User.findById(id)
        if(user.Token === token){
            req.user = user
            next()
        }
        else{
            user.Token = null
            await user.save()
            res.clearCookie('token')
            res.render('main', {layout: 'loginPage', note: 'You need to Login again...'})
        }
    }
    catch(err){
        res.render('main', {layout: 'loginPage', note: 'You need to Login again...'})
    }
}

module.exports = auth