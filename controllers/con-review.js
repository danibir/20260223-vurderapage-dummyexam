const Review = require('../models/mod-review')
const User = require('../models/mod-user')

const create_get = (req, res) => {
    res.render('reviewcreate')
}
const create_post = async (req, res) => {
    try {
        const reviewData = { ...req.body, op: req.username }
        const review = new Review(reviewData)
        await review.save()

        let user = await User.findOne({ username: req.username })
        user.posts.push(review._id) 
        await user.save()

        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/review/create')
    }
}

const view_get = async (req, res) => {
    try {
        const _id = req.params._id
        console.log(_id)
        const review = await Review.findOne({ _id })
        res.render('reviewview', { review })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const delete_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.username
        console.log(_id)
        const review = await Review.findOneAndDelete({ _id })

        if (!review) {
            console.log('couldnt find review')
            return res.redirect('/')
        }
        if (review.op != username) {
            console.log('not authorized user')
            return res.redirect('/')
        }
        
        const user = await User.findOne({ username })
        user.posts = user.posts.filter(item => item !== _id)
        await user.save()
        res.redirect('/')
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    create_get,
    create_post,
    view_get,
    delete_post
}