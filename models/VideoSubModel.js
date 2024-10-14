const mongoose = require('mongoose')


const VideoSubSchema =  mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null 
    },
    expiresAt: {
        type: Date,
        default: null 
    },
    paymentMethod: {
        type: String, 
        required: true
    },
    videoId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video', 
        required: true 
    }



}, {
    timestamps: true
})

module.exports = mongoose.model('VideoSub', VideoSubSchema)