const argon2 = require('argon2')

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
    if (!this.isModified('password')) return
    this.password = await argon2.hash(this.password)
})

userSchema.methods.verifyPassword = function (pw) {
    return argon2.verify(this.password, pw)
}

const User = mongoose.model('User', userSchema, 'users')
module.exports = User