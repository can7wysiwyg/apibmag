const AdminMagaRoute = require("express").Router();
const Magazine = require("../models/MagazineModel");
const Article = require("../models/ArticleModel");
const asyncHandler = require("express-async-handler");
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require("../middleware/authAdmin");
const cloudinary = require("cloudinary").v2;
const fs = require('fs')


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

AdminMagaRoute.post(
  "/adminmagaroute/create_magazine",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {

        const {magazineIssue} = req.body

        if(!magazineIssue) res.json({msg: "magazine name or magazine issue cannot be empty"})


            if (!req.files || !req.files.magazinePhoto ) {
                return res.status(400).json({ message: 'magazine cover photo was not uploaded' });
              }
            
              
              
              const magazinePhotoResult = await cloudinary.uploader.upload(req.files.magazinePhoto.tempFilePath);
              
              

              const magazineSave = new Magazine({
                
                magazineIssue,
                magazinePhoto: magazinePhotoResult.secure_url,
              });
          
              await magazineSave.save();
          
              
              
              fs.unlinkSync(req.files.magazinePhoto.tempFilePath);
    
              
          
              res.json({
                msg: 'Magazine issue created successfully! Time to add articles...',
                
              });
          
        
    




    } catch (error) {
      next(error);
    }
  })
);


AdminMagaRoute.get('/adminmagaroute/new_issue', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {

    const newIssue = await Magazine.find().sort({_id: -1}).limit(1)


    res.json({newIssue})
    
  } catch (error) {
    next(error)
  }



}))


AdminMagaRoute.get('/adminmagaroute/maga_issue/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {
    const{id} = req.params

    const singleIssue = await Magazine.findById({_id: id})

    res.json({singleIssue})


    
  } catch (error) {
    next(error)
  }


}))


AdminMagaRoute.put('/adminmagaroute/update_magazine_issue/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {
    const {id} = req.params

    const { magazineIssue } = req.body;

    await Magazine.updateOne({ _id: id }, { $set: { magazineIssue } });

    res.json({ msg: "successfully updated.." });
    
  } catch (error) {
    next(error)
  }


}) )


AdminMagaRoute.delete('/adminmagaroute/delete_magazine_issue/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {
    
    const{id} = req.params

    await Magazine.findByIdAndDelete(id)

    await Article.deleteMany({articleIssueMonthRef: id})


    res.json({msg: "successfully deleted"})


  } catch (error) {
    next(error)
  }



}) )

module.exports = AdminMagaRoute;
