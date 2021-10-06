const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const morgan = require('morgan')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const movieRouter = require('./routes/movies')
const listRouter = require('./routes/lists')


//connect mongoose
;(async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('Connected to MongoDB ...');
    } catch (error) {
        console.error(error);
    }
})()

//using morgan
app.use(morgan('tiny'))

//middleware body
app.use(express.urlencoded({extended : false}))
app.use(express.json())

//router
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/movies', movieRouter)
app.use('/api/lists', listRouter)

app.listen(5000, () => {
    console.log('Server is running at port 5000....');
})