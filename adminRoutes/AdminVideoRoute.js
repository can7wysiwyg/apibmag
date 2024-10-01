const express = require('express');
const AdminVideoRoute = express.Router();
const Video = require('../models/VideoModel');
const asyncHandler = require("express-async-handler");
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require("../middleware/authAdmin");
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Define the route for uploading videos
AdminVideoRoute.post(
    "/upload_video",
    verifyAdmin,
    authAdmin,

    asyncHandler(async (req, res) => {
        try {
            // Check if the video file is uploaded
            if (!req.files || !req.files.videoFile) {
                return res.status(400).json({ message: 'No video file uploaded.' });
            }

            const videoFile = req.files.videoFile;

            // Upload the video to Cloudinary
            const videoResult = await cloudinary.uploader.upload(videoFile.tempFilePath, {
                resource_type: 'video', // Specify resource type for videos
            });

            // Create a new Video document
            const video = new Video({
                videoLink: videoResult.secure_url,
                videoName: req.body.videoName, // Expecting video name in the body
            });

            // Save the video document to the database
            await video.save();

            // Clean up temporary file
            fs.unlinkSync(videoFile.tempFilePath);

            res.json({
                msg: 'Video uploaded successfully!'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to upload video.', error: error.message });
        }
    })
);

module.exports = AdminVideoRoute;
