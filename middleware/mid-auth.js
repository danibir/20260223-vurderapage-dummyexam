const User = require('../models/mod-user')
const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    const token = req.cookies?.accessToken
    let username = null

    if (token) {
        try {
            const payload = jwt.verify(token, 'your_jwt_secret')
            const user = await User.findOne({ username: payload.username })
            username = user.username || null
        } catch (err) {
            req.username = null

            if (err.name === "TokenExpiredError") {
                res.clearCookie('accessToken')
            }
        }
    }

    req.username = username
    res.locals.username = username

    next()
}

module.exports = {
    authenticate
}