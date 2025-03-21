const ArticleRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Article = require('../models/ArticleModel')



ArticleRoute.get('/articleroute/article_single/:id', asyncHandler(async(req, res, next) => {


    try {
   
         const {id} = req.params

         const articleSingle = await Article.findById({_id: id})

         res.json({articleSingle})


        
    } catch (error) {
        next(error)
    }



}))





ArticleRoute.get('/articleroute/showing_articles', asyncHandler(async(req, res, next) => {


    try {
   
         

         const articles = await Article.find().sort({_id: -1})

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


// ArticleRoute.put('/articleroute/update_article_clicks/:id', asyncHandler(async(req, res) => {
//     try {
//         const {id} = req.params;
//         console.log(req.body)
//         const updatedArticle = await Article.findByIdAndUpdate(
//             id, 
//             { articleClicks: req.body.articleClicks },
//             { new: true }
//         );
//     res.json(updatedArticle)
//     } catch (error) {
//         res.status(500).json({msg: "there was a problem"});
//     }
// }))


ArticleRoute.put('/articleroute/update_article_clicks/:id', asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
         await Article.findByIdAndUpdate(
            id, 
            { $inc: { articleClicks: 1 } },  // Increment by 1
            { new: true }
        );
    
    } catch (error) {
        res.status(500).json({msg: "there was a problem"});
    }
}))


module.exports = ArticleRoute