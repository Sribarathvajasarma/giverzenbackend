const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png"
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)