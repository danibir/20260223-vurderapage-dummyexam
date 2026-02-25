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
    isAdmin: {
        type: Boolean,
        default: false
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
})

userSchema.methods.verifyPassword = function (pw) {
    return argon2.verify(this.password, pw)
}

userSchema.post('findOneAndDelete', async function (doc) {
    if (!doc)
    {
        return
    }
    
    const Review = mongoose.model('Review')
    await Review.updateMany({},{
        $pull: {
            likes: doc._id,
            dislikes: doc._id,
            reports: doc._id
        }}) 
    await Review.deleteMany({ op: doc.username})
})


const User = mongoose.model('User', userSchema, 'users')
module.exports = User