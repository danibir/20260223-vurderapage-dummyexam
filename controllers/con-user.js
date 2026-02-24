const User = require('../models/mod-user')
const jwt = require('jsonwebtoken')

const login_get = (req, res) => {
    if (!req.username)
    {
        res.render('login')
    }
    else
    {
        console.log('aleady logged in')
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
            console.log('login successful')
            res.redirect('/')
        }
    }
    if (fail == true)
    {
        console.log('login fail, wrong username or password')
        res.redirect('/user/login')
    }
}

const signup_get = (req, res) => {
    if (!req.username)
    {
        res.render('signup')
    }
    else
    {
        console.log('aleady logged in')
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
            newObj.save()
            const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '31m' })
            res.cookie('accessToken', token, { httpOnly: true, sameSite: 'strict'})
            console.log('signup successful')
            res.redirect('/')
        }
        else
        {
            console.log('signup fail, username already taken')
            res.redirect('/user/signup')
        }
    }
    else
    {
        console.log('signup fail, passwords does not match')
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
        posts: user.posts
    }
    res.render('profile', {profileUser})
}

const user_delete = async (req, res) => {
    try {
        const username = req.username
        const user = await User.findOneAndDelete({ username })

        if (!user) {
            return res.redirect('/')
        }

        res.clearCookie('accessToken')
        res.redirect('/')
    } catch (err) {
        console.error(err)
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