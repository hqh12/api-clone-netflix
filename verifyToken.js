const jwt = require('jsonwebtoken')

//middleware for verifyToken
const verifyToken = (req, res, next) => {
    const authHeaders = req.headers.token//set variable headers : token
    if (authHeaders != null & authHeaders != ''){
        const token = authHeaders.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json('Invalid token!, try again')//403 : Forbidden
            req.user = user //user contain id, isAdmin
            //console.log(user);
            next()
        })
    }else {
        return res.status(401).json('You are not authenticated')//401 : Not authenticated
    }
}

module.exports = {verifyToken}