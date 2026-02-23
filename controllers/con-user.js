const User = require('../models/mod-user')

const login_get = (req, res) => {
    res.render('login')
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
            console.log('login successful')
            //login logic
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
    res.render('signup')
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
            //signin logic
            console.log('signup successful')
            res.redirect('/')
        }
        else
        {
            console.log('signup fail, username already taken')
            es.redirect('/user/signup')
        }
    }
    else
    {
        console.log('signup fail, passwords does not match')
        res.redirect('/user/signup')
    }
}

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post
}