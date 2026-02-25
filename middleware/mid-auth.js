const User = require('../models/mod-user')
const jwt = require('jsonwebtoken')
const { createFlashCookie } = require('../util/flashMessage')

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
        res.clearCookie('accessToken')
        createFlashCookie(res, 'Bruker logget ut; mangler autentisering.')
        return res.redirect('/user/login')
    }
    else 
    {
        const user = await User.findOne({ username: req.user.username })
        if (!user)
        {
            res.clearCookie('accessToken')
            createFlashCookie(res, 'Bruker logget ut; kunne ikke finne bruker i database.')
            return res.redirect('/user/login')
        }
    }
    next()
}

const authAdmin = [
    authLogin,
    async (req, res, next) => {
        const user = await User.findOne({ username: req.user.username })
        if (user.isAdmin == false)
        {
            createFlashCookie(res, 'Du har ikke tilgang til siden, administratortillatelse kreves.')
            return res.redirect('/')
        }
        next()
    }
]
module.exports = {
    authenticate,
    authLogin,
    authAdmin
}