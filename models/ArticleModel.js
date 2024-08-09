const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({

    articlePhoto: {
        type: String,
        required: true
    },
    articleTitle: {
        type: String,
        required: true
    },
    articleAuthor: {
        type: String,
        required: true
    },
    articleContent: {
        type: String,
        required: true
    },
    articleCategory: {
        type: String,
        required: true
    },
    articleIssueMonthRef: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Magazine"
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Article', ArticleSchema)