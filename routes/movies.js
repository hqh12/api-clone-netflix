const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const user = require('../models/user')
const {verifyToken} = require('../verifyToken')


//create a movie
router.post('/', verifyToken, async(req, res) => {
    if(req.user.isAdmin == true){
        try {
            const newMovie = new Movie(req.body)
            const savedMovie = await newMovie.save()
            res.status(201).json(savedMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
})

//update movie
router.put('/:id', verifyToken, async(req, res) => {
    if(req.user.isAdmin == true){
        try {
            const updateMovie = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body
            },
            {new : true})
            res.status(200).json(updateMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
})

//delete movie
router.delete('/:id', verifyToken, async(req, res) => {
    if(req.user.isAdmin == true){
        try {
            await Movie.findByIdAndDelete(req.params.id)
            res.status(200).json("The movie has been deleted...")
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json('You are not allow to do that...')
    }
})

//get a movie
router.get('/find/:id', verifyToken, async(req, res) => {
        try {
            const movie = await Movie.findById(req.params.id)
            res.status(200).json(movie)
        } catch (error) {
            
            res.status(500).json(error)
        } 
    }
)

//get random movie
router.get('/random', verifyToken, async(req, res) => {
    const type = req.query.type
    let movie
    try {
       if (type === "series"){
           movie = await Movie.aggregate([
               {$match : {isSeries : true}},
               {$sample : {size : 1}}
           ])
       }else {
        movie = await Movie.aggregate([
            {$match : {isSeries : false}},
            {$sample : {size : 1}}
        ])
       }
       res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    } 
}
)

//get all movie
router.get('/', verifyToken, async(req, res) => {
    const query = req.query.top
    try {
        const movie = query ? await Movie.find().sort({_id : -1}).limit(5) : await Movie.find()
        res.status(200).json(movie.reverse())
    } catch (error) {
        res.status(500).json(error)
    } 
}
)

module.exports = router