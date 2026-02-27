const User = require('../models/mod-user')
const Review = require('../models/mod-review')
const jwt = require('jsonwebtoken')
const { createFlashCookie } = require('../util/flashMessage')

const login_get = (req, res) => {
    if (!req.user)
    {
        res.render('login')
    }
    else
    {
        createFlashCookie(res, 'Allerede logget på.', 'info')
        res.redirect('/')
    }
}
const login_post = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    let fail = true

    const user = await User.findOne({ username })
    if (user)
    {
        console.log(user)
        const verified = await user.verifyPassword(password)
        if (verified) 
        {   
            fail = false
            const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '31m' })
            res.cookie('accessToken', token, { httpOnly: true, sameSite: 'strict'})
            createFlashCookie(res, 'Logget inn!', 'success')
            res.redirect('/')
        }
    }
    if (fail == true)
    {
        createFlashCookie(res, 'Feil brukernavn eller passord.', 'error')
        res.redirect('/user/login')
    }
}

const signup_get = (req, res) => {
    if (!req.user)
    {
        res.render('signup')
    }
    else
    {
        createFlashCookie(res, 'Allerede logget på.', 'info')
        res.redirect('/')
    }
}
const signup_post = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const confirm = req.body.confirm

    if (password == confirm) 
    {
        const user = await User.findOne({ username })
        if (!user)
        {
            const obj = {
                username,
                password
            }
            let newObj = new User(obj)
            await newObj.save()
            const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '31m' })
            res.cookie('accessToken', token, { httpOnly: true, sameSite: 'strict'})
            console.log('signup successful')
            res.redirect('/')
        }
        else
        {
            createFlashCookie(res, 'Brukernavn allerede tatt.', 'error')
            res.redirect('/user/signup')
        }
    }
    else
    {
        
        createFlashCookie(res, 'Passordene samsvarer ikke med hverandre.', 'error')
        res.redirect('/user/signup')
    }
}

const logout_post = (req, res) => {
    res.clearCookie('accessToken')
    res.redirect('/')
}

const profile_get = async (req, res) => {
    const username = req.params.username
    const user = await User.findOne({ username })
    const profileUser = {
        username: user.username,
        posts: user.posts,
        isAdmin: user.isAdmin
    }
    res.render('profile', {profileUser})
}

const user_delete = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findOneAndDelete({ username })

        if (!user) {
            return res.redirect('/')
        }
        res.clearCookie('accessToken')
        createFlashCookie(res, 'Bruker slettet', 'info')
        res.redirect('/')
    } catch (err) {
        console.error(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect(`/profile/${username}`)
    }
}


module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post,
    logout_post,
    profile_get,
    user_delete
}