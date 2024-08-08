const mongoose = require('mongoose')

const ArtGenreSchema = mongoose.Schema({
    genreName: {
        type: String,
        required: true,
        unique: true
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('ArticleGenre', ArtGenreSchema)