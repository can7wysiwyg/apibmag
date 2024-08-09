const AdminArticleRoute = require("express").Router();
const asyncHandler = require("express-async-handler");
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require("../middleware/authAdmin");
const Article = require("../models/ArticleModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

AdminArticleRoute.post(
  "/adminarticleroute/create_new_article/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {

try {

    const{id} = req.params
    const{articleCategory, articleContent, articleAuthor, articleTitle} = req.body

    if(!articleAuthor) res.json({msg: "article author cannot be empty"})

    if(!articleCategory) res.json({msg: "article category cannot be empty"})

    if(!articleContent) res.json({msg: "article content cannot be empty"})

    if(!articleTitle) res.json({msg: "article title cannot be empty"})

    

    if(!req.files || !req.files.articlePhoto ) {
            return res.status(400).json({ message: 'article photo was not uploaded' });
          }
        
          
          
    const articlePhotoResult = await cloudinary.uploader.upload(req.files.articlePhoto.tempFilePath);
              
    const articleSave = new Article({
        articleAuthor,
        articleCategory,
        articleContent,
        articleTitle, 
        articleIssueMonthRef: id,       
        articlePhoto: articlePhotoResult.secure_url,
      });
  
      await articleSave.save();
  
      
      
      fs.unlinkSync(req.files.articlePhoto.tempFilePath);

      
  
      res.json({
        msg: 'article created successfully!',
        
      });
    
} catch (error) {
    next(error)
}




  })
);



module.exports = AdminArticleRoute;
