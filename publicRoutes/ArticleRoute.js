const ArticleRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Article = require('../models/ArticleModel')



ArticleRoute.get('/articleroute/articles_by_magazineissue/:id', asyncHandler(async(req, res, next) => {


    try {
   
         const {id} = req.params

         const articlesByIssue = await Article.find({articleIssueMonthRef: id})

         res.json({articlesByIssue})


        
    } catch (error) {
        next(error)
    }



}))


ArticleRoute.get('/articleroute/article_by_magazineissue/:id', asyncHandler(async(req, res, next) => {


    try {
   
         const {id} = req.params

         const articleByIssue = await Article.findById({_id: id})

         res.json({articleByIssue})


        
    } catch (error) {
        next(error)
    }



}))



ArticleRoute.get('/articleroute/showing_articles', asyncHandler(async(req, res, next) => {


    try {
   
         

         const articles = await Article.find().sort({_id: -1}).limit(8)

         res.json({articles})


        
    } catch (error) {
        next(error)
    }



}))



ArticleRoute.get('/articleroute/articles_by_genre/:id', asyncHandler(async(req, res, next) => {


    try {

        const{id} = req.params
         
        const articlesByGenre = await Article.find({articleCategory: id})

        res.json({articlesByGenre})

        
    } catch (error) {
        next(error)
    }


}))




module.exports = ArticleRoute