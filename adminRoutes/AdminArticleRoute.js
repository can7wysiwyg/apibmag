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
      const { id } = req.params;
      const { articleCategory, articleContent, articleAuthor, articleTitle } =
        req.body;

      if (!articleAuthor) res.json({ msg: "article author cannot be empty" });

      if (!articleCategory)
        res.json({ msg: "article category cannot be empty" });

      if (!articleContent) res.json({ msg: "article content cannot be empty" });

      if (!articleTitle) res.json({ msg: "article title cannot be empty" });

      if (!req.files || !req.files.articlePhoto) {
        return res
          .status(400)
          .json({ message: "article photo was not uploaded" });
      }

      const articlePhotoResult = await cloudinary.uploader.upload(
        req.files.articlePhoto.tempFilePath
      );

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
        msg: "article created successfully!",
      });
    } catch (error) {
      next(error);
    }
  })
);

AdminArticleRoute.put(
  "/adminarticleroute/update_content/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      const { articleContent } = req.body;

      await Article.updateOne({ _id: id }, { $set: { articleContent } });

      res.json({ msg: "successfully updated.." });
    } catch (error) {
      next(error);
    }
  })
);

AdminArticleRoute.put(
  "/adminarticleroute/update_title/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      const { articleTitle } = req.body;

      await Article.updateOne({ _id: id }, { $set: { articleTitle } });

      res.json({ msg: "successfully updated.." });
    } catch (error) {
      next(error);
    }
  })
);

AdminArticleRoute.put(
  "/adminarticleroute/update_author/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      const { articleAuthor } = req.body;

      await Article.updateOne({ _id: id }, { $set: { articleAuthor } });

      res.json({ msg: "successfully updated.." });
    } catch (error) {
      next(error);
    }
  })
);

AdminArticleRoute.put(
  "/adminarticleroute/update_article_photo/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      const article = await Article.findById(id);

      if (!article) {
        return res.status(404).json({ msg: "article not found." });
      }

      if (article.articlePhoto) {
        const publicId = article.articlePhoto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      const articlePhoto = req.files.articlePhoto;

      const result = await cloudinary.uploader.upload(
        articlePhoto.tempFilePath
      );

      article.articlePhoto = result.secure_url;

      await article.save();

      fs.unlinkSync(bookImage.tempFilePath);

      res.json({ msg: "Article picture updated successfully." });
    } catch (error) {
      next(error);
    }
  })
);

AdminArticleRoute.delete(
  "/adminarticleroute/delete_article/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      await Article.findByIdAndDelete(id);

      res.json({ msg: "article has been successfully deleted" });
    } catch (error) {
      next(error);
    }
  })
);

module.exports = AdminArticleRoute;
