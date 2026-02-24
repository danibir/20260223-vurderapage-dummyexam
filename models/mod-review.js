const argon2 = require('argon2')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    url: {
        type: String,
        require: true
    }
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')
module.exports = Review