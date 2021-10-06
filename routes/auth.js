const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//register user
router.post('/register', async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    })
    try {
        const userCreated = await newUser.save()
        res.status(201).json(userCreated)
    } catch (error) {
        res.status(500).json(error)
    }
})

//login
router.post('/login', async(req, res) => {
    const user = await User.findOne({
        email : req.body.email
    })
    if (user == null){
        res.status(401).json('Wrong password or email')
    }
    try {
        const checkHashedPassword = await bcrypt.compare(req.body.password, user.password)
        if(checkHashedPassword == false){
            res.status(401).json('Wrong password or email')
        }
        const accessToken = jwt.sign(
            {id : user._id, isAdmin : user.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn : '3d'}
        )
        const {password, ...info} = user._doc //hide password when login, using destructuring operator
        res.status(200).json({info, accessToken})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router