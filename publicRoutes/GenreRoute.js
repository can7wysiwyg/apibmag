const GenreRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const ArticleGenre = require('../models/ArtGenreModel')



GenreRoute.get('/genreroute/get_all_genres', asyncHandler(async(req, res, next) => {

try {

    const categories = await ArticleGenre.find()

    res.json({categories})
    
} catch (error) {
    next(error)
}

}))



module.exports = GenreRoute