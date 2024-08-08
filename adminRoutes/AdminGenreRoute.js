const AdminGenreRoute = require('express').Router()
const ArticleGenre = require('../models/ArtGenreModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const asyncHandler = require('express-async-handler')


AdminGenreRoute.post('/admingenreroute/create_genre', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


    try {

        const{genreName} = req.body

        if(!genreName) res.json({msg: "the genre cannot be empty"})

            const genres = await ArticleGenre.find()

            let genreExists = false;


            genres.forEach(genre => {
                if (genre.genreName.includes(genreName)) {
                  genreExists = true;
                }
              });
            
              if (genreExists) {
                return res.json({ msg: "this genre already exists!" });
              }
            
                    await ArticleGenre.create({
                        genreName
                    })
            
                    res.json({msg: "genre successfully created"})
            
            


               


        
    } catch (error) {
        next(error)
    }



}))

AdminGenreRoute.get('/admingenreroute/show_genres', asyncHandler(async(req, res, next) => {


    try {

        const genres = await ArticleGenre.find()

        res.json({genres})
        
    } catch (error) {
        next(error)
    }



}))



module.exports = AdminGenreRoute



