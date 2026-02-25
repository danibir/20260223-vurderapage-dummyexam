const User = require('../models/mod-user')
const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    const token = req.cookies?.accessToken
    let user = null

    if (token) {
        try {
            const payload = jwt.verify(token, 'your_jwt_secret')
            user = await User.findOne({ username: payload.username }) || null
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                res.clearCookie('accessToken')
            }
            req.user = null
        }
    }

    req.user = user
    res.locals.user = user

    next()
}
const authLogin = async (req, res, next) => {
    if (!req.user) {
        console.log('authLogin fail, login required, but missing')
        return res.redirect('/')
    }
    else 
    {
        const user = await User.findOne({ username: req.user.username })
        if (!user)
        {
            console.log('authLogin fail, invalid username, cant be found in database')
            return res.redirect('/')
        }
    }
    next()
}

module.exports = {
    authenticate,
    authLogin
}