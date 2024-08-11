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



GenreRoute.get('/genreroute/get_single_genre/:id', asyncHandler(async(req, res, next) => {

    try {
        
        const {id} = req.params

        const category = await ArticleGenre.findById({_id: id})
    
        res.json({category})
        
    } catch (error) {
        next(error)
    }
    
    }))
    



module.exports = GenreRoute