const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = require('./mod-user')

const reviewSchema = new Schema({
    op: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    imageurl: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    likes: {
        type: Array,
        default: []
    },
    dislikes: {
        type: Array,
        default: []
    },
    reports: {
        type: Array,
        default: []
    }
})

reviewSchema.post('findOneAndDelete', async function (doc) { 
    if (!doc) {
        return 
    }
    await User.updateOne({ username: doc.op }, { $pull: { posts: doc._id }})
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')
module.exports = Review