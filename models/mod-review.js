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
    }
})


const Review = mongoose.model('Review', reviewSchema, 'reviews')
module.exports = Review