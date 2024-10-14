const VideoSubsRoute = require('express').Router()
const VideoSub = require('../models/VideoSubModel')
const asyncHandler = require('express-async-handler')
const Video = require('../models/VideoModel')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD  // your email password or app password
    }
});


const sendEmailToAdmin = async (username, email, phonenumber, transactionId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // your email
        to: 'paulkssa@gmail.com', // admin email address
        subject: 'New Video Subscription Alert',
        text: `A new video subscription has been made by ${username}.\nEmail: ${email}.\nPhone Number: ${phonenumber}\nTransaction ID: ${transactionId}`
    }; }



    VideoSubsRoute.post('/video_subscriber_credentials_submit', asyncHandler(async (req, res) => {
        try {
            const { username, email, phonenumber, transactionId, paymentMethod, videoId } = req.body;
    
            // Validation
            if (!username) return res.json({ msg: "username cannot be empty" });
            if (!email) return res.json({ msg: "email cannot be empty" });
            if (!phonenumber) return res.json({ msg: "phonenumber cannot be empty" });
            if (!transactionId) return res.json({ msg: "transaction id cannot be empty" });
            if (!paymentMethod) return res.json({ msg: "payment method cannot be empty" });
    
            // Create Reader
            const newVideoSub = await Reader.create({
                username,
                email,
                phonenumber,
                transactionId,
                paymentMethod,
                videoId
            });
    
            // Send email to admin
            await sendEmailToAdmin(username, email, phonenumber, transactionId);
    
            // Response
            res.json({ msg: "You will be emailed a token to use to watch the video.. please be patient.." });
    
        } catch (error) {
            res.json({ msg: `There was a problem ${error}` });
        }
    }));
    

    VideoSubsRoute.post('/watch_video_subscribed', asyncHandler(async(req, res) => {


        try {
    
            const { token } = req.body; 
    
            if (!token) {
                return res.json({ msg: 'Token is required' });
            }
        
            const [generatedToken, videoId] = token.split('-'); 
    
    
                    
                    const watcherEntry = await Reader.findOne({ token: `${generatedToken}-${videoId}` });
    
                    
                    if (!watcherEntry) {
                        return res.json({ msg: 'Access denied. Invalid token or VIDEO SUBSCRIPTION ID.' });
                    }
            
                    const currentTime = new Date();
                    if (watcherEntry.expiresAt < currentTime) {
                        return res.json({ msg: 'Access denied. Token has expired.' });
                    }
            
                    
                    const video = await Video.findById(videoId);
                    if (!video) {
                        return res.json({ msg: 'Video not found.' });
                    }
            
                    
                    res.json({video, watcherEntry});
            
        
    
    
            
        } catch (error) {
            res.json({msg: `there was a problem: ${error}`})
        }
    
    
    }))


    VideoSubsRoute.get('/video_sub_by_token/:token', asyncHandler(async(req, res) => {

        try {
        
            const {token} = req.params
        
            const item = await VideoSub.findOne({token})
        
            res.json({item})
        
        
            
        } catch (error) {
            res.json({msg: `there was a problem: ${error}`})
            
        }
        
        }))
        
        


module.exports = VideoSubsRoute