const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    articleName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    commentOwner: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Comment', CommentSchema)