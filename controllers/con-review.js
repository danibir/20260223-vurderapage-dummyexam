const Review = require('../models/mod-review')
const User = require('../models/mod-user')
const upload = require("../handlers/han-upload")

const create_get = (req, res) => {
    res.render('reviewcreate')
}
const create_post = async (req, res) => {
    try {
        const reviewData = { ...req.body, op: req.user.username }

        if (req.file) {
            const localPath = req.file.path
            reviewData.imageurl = await upload.uploadImageSFTP(localPath, req.file.originalname)
        }

        console.log(req.file)

        const review = new Review(reviewData)
        await review.save()

        let user = await User.findOne({ username: req.user.username })
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
        const username = req.user.username
        const review = await Review.findOneAndDelete({ _id })

        if (!review) {
            console.log('couldnt find review')
            return res.redirect('/')
        }
        if (review.op != username) {
            console.log('not authorized user')
            return res.redirect('/')
        }
        if (review.imageurl) { 
            await upload.deleteImageSFTP(review.imageurl)
        }
        
        const user = await User.findOne({ username })
        user.posts = user.posts.filter(item => item !== _id)
        await user.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
}

const like_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username

        const review = await Review.findOne({ _id })
        const user = await User.findOne({ username })       
        if (!review) {
            console.log('couldnt find review')
            return res.redirect('/')
        }
        if (review.op == username) {
            console.log('not authorized user; you cant vote for your own post!')
            return res.redirect('/')
        }
        
        const alreadyLiked = review.likes.some(id => id.toString() === user._id.toString())
        
        if (!alreadyLiked) {
            review.likes.push(user._id)
            review.dislikes = review.dislikes.filter(id => id.toString() !== user._id.toString())
        } else {
            review.likes = review.likes.filter(id => id.toString() !== user._id.toString())
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
    }
}
const dislike_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username

        const review = await Review.findOne({ _id }) 
        const user = await User.findOne({ username })       
        if (!review) {
            console.log('couldnt find review')
            return res.redirect('/')
        }
        if (review.op == username) {
            console.log('not authorized user; you cant vote for your own post!')
            return res.redirect('/')
        }
        const alreadyDisliked = review.dislikes.some(id => id.toString() === user._id.toString())
        
        if (!alreadyDisliked) {
            review.dislikes.push(user._id)
            review.likes = review.likes.filter(id => id.toString() !== user._id.toString())
        } else {
            review.dislikes = review.dislikes.filter(id => id.toString() !== user._id.toString())
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    create_get,
    create_post,
    view_get,
    delete_post,
    like_post,
    dislike_post
}