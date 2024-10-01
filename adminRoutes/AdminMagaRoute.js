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


            if (!req.files || !req.files.magazinePhoto || !req.files.magazinePdfFile ) {
                return res.status(400).json({ message: 'magazine cover photo was not uploaded' });
              }
            
              
              
              const magazinePhotoResult = await cloudinary.uploader.upload(req.files.magazinePhoto.tempFilePath);
               
              const pdfFileResult = await cloudinary.uploader.upload(req.files.magazinePdfFile.tempFilePath, {
                resource_type: 'auto', // Set resource type to "auto" to handle different file types
              });
          
            console.log(!req.files.magazinePhoto, !req.files.magazinePdfFile);
              

              const magazineSave = new Magazine({
                
                magazineIssue,
                magazinePhoto: magazinePhotoResult.secure_url,
                magazinePdfFile: pdfFileResult.secure_url
              });
          
              await magazineSave.save();
          
              
              
              fs.unlinkSync(req.files.magazinePhoto.tempFilePath);
              fs.unlinkSync(req.files.magazinePdfFile.tempFilePath);
    
    
              
          
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



AdminMagaRoute.put('/adminmagaroute/update_magazine_pdf_file/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
  try {
    const { id } = req.params;

    const magazine = await Magazine.findById(id);
    if (!magazine) {
      return res.status(404).json({ msg: "Magazine not found." });
    }

    // If there's an existing PDF file, delete it from Cloudinary
    if (magazine.magazinePdfFile) {
      const publicId = magazine.magazinePdfFile.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Check if any files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    const magazineFile = req.files.magazinePdfFile;

    // Upload new PDF to Cloudinary
    const result = await cloudinary.uploader.upload(magazineFile.tempFilePath, {
      resource_type: 'auto', // Ensure that it's set to auto
    });

    if (result && result.secure_url) {
      magazine.magazinePdfFile = result.secure_url;
      await magazine.save();

      // Clean up temp file
      fs.unlinkSync(magazineFile.tempFilePath);

      // Return success message with updated magazine
      res.json({ msg: "Updated successfully.", updatedMagazine: magazine });
    } else {
      res.status(500).json({ msg: "Failed to upload PDF file." });
    }

  } catch (error) {
    console.error("Error updating magazine PDF file:", error);
    next(error);
  }
}));





AdminMagaRoute.put('/adminmagaroute/update_magazine_cover_photo/:id', verifyAdmin, authAdmin,  asyncHandler(async(req, res, next) => {
  // verifyAdmin, authAdmin,

  try {

    const {id} = req.params

    const magazine = await Magazine.findById(id);
    
          if (!magazine) {
            return res.status(404).json({ msg: "Magazine not found." });
          }
    
          if (magazine.magazinePhoto) {
            const publicId = magazine.magazinePhoto.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }
    
          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No file uploaded." });
          }
    
          const magazinePhoto = req.files.magazinePhoto;
    
          const result = await cloudinary.uploader.upload(magazinePhoto.tempFilePath);
    
          magazine.magazinePhoto = result.secure_url;
    
          await magazine.save();
    
          fs.unlinkSync(magazinePhoto.tempFilePath);
    
          res.json({ msg: "Magazine picture updated successfully." });
    
    





    
  } catch (error) {
    next(error)
  }


}))



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
