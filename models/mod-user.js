const argon2 = require('argon2')

const Review = require('./mod-review')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    posts: {
        type: Array,
        default: []
    }
})

    userSchema.pre('save', async function () {
        if (this.isModified('password')) {
            this.password = await argon2.hash(this.password)
        }
        if (this.isModified('posts'))
        {
            for (var i = 0; i < this.posts.length; i++) {
                const postExists = await Review.exists({ _id: this.posts[i] })
                if (!postExists)
                {
                    this.posts.splice(i, 1)
                    i--
                }
            }
        }
    })

userSchema.methods.verifyPassword = function (pw) {
    return argon2.verify(this.password, pw)
}

const User = mongoose.model('User', userSchema, 'users')
module.exports = User