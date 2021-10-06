const express = require('express')
const router = express.Router()
const List = require('../models/list')
const user = require('../models/user')
const {verifyToken} = require('../verifyToken')

//create a list
router.post('/', verifyToken,  async(req, res) =>{
    if(req.user.isAdmin == true){
        try {
            const newList = new List(req.body)
            const savedList = await newList.save()
            res.status(201).json(savedList) 
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
})

//delete a list
router.delete('/:id', verifyToken,  async(req, res) =>{
    if(req.user.isAdmin == true){
        try {
            await List.findByIdAndDelete(req.params.id)
            res.status(200).json("The List has been deleted...")
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
})

//get movies to click title : movies, series, genre
router.get('/', verifyToken, async(req, res) => {
    const typeQuery = req.query.type
    const genreQuery = req.query.genre 
    let list
    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size : 10}},
                    {$match : {type: typeQuery, genre : genreQuery}}
                ])
            }else {
                list = await List.aggregate([
                    {$sample: {size : 10}},
                    {$match : {type: typeQuery}}
                ])
            }
        }else {
            list = await List.aggregate([{$sample: {size : 10}}])
        }
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router
