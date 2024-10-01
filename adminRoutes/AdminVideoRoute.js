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
            res.json({ message: 'Failed to upload video.', error: error.message });
        }
    })
);

AdminVideoRoute.put('/update_video/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

    
try {
    
} catch (error) {

    console.error(error);
            res.json({ message: 'Failed to upload video.', error: error.message });
    
}


}))


// verifyAdmin,
//     authAdmin,
AdminVideoRoute.put(
    '/update_video/:id',
     verifyAdmin,
   authAdmin,

    
    asyncHandler(async (req, res) => {
        try {
            const videoId = req.params.id;

            // Find the video by ID
            const video = await Video.findById(videoId);
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            // Check if new video file is provided for upload
            if (req.files && req.files.videoFile) {
                const videoFile = req.files.videoFile;

                // Upload new video to Cloudinary
                const videoResult = await cloudinary.uploader.upload(videoFile.tempFilePath, {
                    resource_type: 'video', // Specify resource type for videos
                });

                // Update the video link with the new URL
                video.videoLink = videoResult.secure_url;

                // Clean up temporary file
                fs.unlinkSync(videoFile.tempFilePath);
            }

            // Update the video name if provided
            if (req.body.videoName) {
                video.videoName = req.body.videoName;
            }

            // Save the updated video document
            await video.save();

            res.json({ message: 'Video updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update video.', error: error.message });
        }
    })
);


AdminVideoRoute.put(
    '/update_video_name/:id',
    verifyAdmin,
    authAdmin,
    asyncHandler(async (req, res) => {
        try {
            const videoId = req.params.id;
            const { videoName } = req.body;

            // Find the video by ID
            const video = await Video.findById(videoId);
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            // Update the video name if provided
            if (videoName) {
                video.videoName = videoName;
            } else {
                return res.status(400).json({ msg: 'No video name provided' });
            }

            // Save the updated video document
            await video.save();

            res.json({ message: 'Video name updated successfully', video });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update video name.', error: error.message });
        }
    })
);

AdminVideoRoute.delete('/erase_video/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {



    try {

        const {id} = req.params

        const findVideo = await Video.findById(id)

          if(!findVideo) res.json({msg: "video not found"})

        
            await Video.findByIdAndDelete(id)

            res.json({msg: "video has been successfully deleted"})
        
    } catch (error) {

        console.error(error);
            res.status(500).json({ message: 'Failed to update video name.', error: error.message });
        


    }
}))

module.exports = AdminVideoRoute;
