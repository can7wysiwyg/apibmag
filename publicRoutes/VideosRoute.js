const VideosRoute = require('express').Router();
const Video = require('../models/VideoModel');
const asyncHandler = require('express-async-handler');

// Route to get all videos
VideosRoute.get(
    '/videos_all',
    asyncHandler(async (req, res) => {
        try {
            const videos = await Video.find({}).sort({_id: -1});
            res.json({videos});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve videos.', error: error.message });
        }
    })
);

// Route to get a single video by ID
VideosRoute.get(
    '/video_single/:id',
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        try {
            const video = await Video.findById(id);
            if (!video) {
                return res.json({ message: 'Video not found.' });
            }
            res.json({video});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve video.', error: error.message });
        }
    })
);


VideosRoute.get(
    '/videos_by_genre/:id',
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        try {
            const videosByGenre = await Video.find({videoGenre: id});
            if (!videosByGenre) {
                return res.json({ message: ' not found.' });
            }
            res.json({videosByGenre});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve video.', error: error.message });
        }
    })
);


module.exports = VideosRoute;
