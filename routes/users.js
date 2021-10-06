const express = require('express')
const router = express.Router()
const User = require('../models/user')
const {verifyToken} = require('../verifyToken')
const bcrypt = require('bcrypt')

//Update user
router.put('/:id', verifyToken , async(req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin == true){
        if (req.body.password != "" && req.body.password != null){
            req.body.password = await bcrypt.hash(req.body.password, 10)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body
            },
            {new : true})
            res.status(200).json(updatedUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You can update only your account')
    }
})

//Delete user
router.delete('/:id', verifyToken , async(req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin == true){
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You can delete only your own account')
    }
})
//get a user
router.get('/find/:id', verifyToken , async(req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin == true){
        try {
            const user = await User.findById(req.params.id)
            const {password, ...info} = user._doc
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('Cant find information ...')
    }
})

//get all user
router.get('/', verifyToken , async(req, res) => {
    const query = req.query.top
    if (req.user.isAdmin == true){
        try {
            const users = query ? await User.find().sort({_id : -1}).limit(5) : await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
    //res.status(200).json(req.query.top) 
})
//get user stats
router.get('/stats', verifyToken, async(req, res) => {
    if (req.user.isAdmin == true){
        const date = new Date()
        const lastYear = date.setFullYear(date.setFullYear() - 1)
        try {
            const data = await User.aggregate([
                {
                    $project : {
                        month : {$month : '$createdAt'}
                    }
                },
                {
                    $group : {
                        _id: "$month",
                        total : {$sum : 1}
                    }
                },
                {
                    $sort : {
                        _id : -1
                    }
                }
            ])
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
})

module.exports = router