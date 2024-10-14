const AdminVideoSubRoute = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const VideoSub = require('../models/VideoSubModel')
const VideoScheduler = require('../models/VideoSubScheduModel')
const asyncHandler = require('express-async-handler')
const crypto  = require('crypto')


AdminVideoSubRoute.get('/video_subscriptions_all', verifyAdmin, authAdmin, asyncHandler(async(requestAnimationFrame, res) => {


    try {

        const subscribedVideos = await VideoSub.find().sort({_id: -1})

        res.json({subscribedVideos})
        
    } catch (error) {
        res.json({msg: `there was an error: ${error}`})
    }


}))



AdminVideoSubRoute.get('/video_subscription_single/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {


    try {

        const {id} = req.params

        const subscribedVideo = await VideoSub.findById({_id: id})

        res.json({subscribedVideo})
        
    } catch (error) {
        res.json({msg: `there was an error: ${error}`})
    }


}))


AdminVideoSubRoute.post('/video_sub_generate_token', verifyAdmin, authAdmin, asyncHandler(async(requestAnimationFrame, res) => {


    try {

        const { transactionId, videoId } = req.body;

        const randomToken = crypto.randomBytes(16).toString('hex');
        const token = `${randomToken}-${videoId}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); 
        
        

        const updatedVideoSub = await VideoSub.findOneAndUpdate(
            { transactionId },
            { token, expiresAt, videoId },
            { new: true }
        );

        if (!updatedVideoSub) {
            return res.json({ msg: 'Video Subscriber not found' });
        }

        
        await VideoScheduler.create({
            VideoSubId: updatedVideoSub._id,
            expiresAt
        });

        res.json({ token, expiresAt, videoId });

        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }

}))



async function deleteExpiredVideoSubscriptions() {
    try {
        const now = new Date();

        
        const allTasks = await VideoScheduler.find();

        if (allTasks.length === 0) {
            console.log("No tasks found.");
            return;
        }

        
        for (const task of allTasks) {
            const expiresAt = new Date(task.expiresAt); 

            

            
            if (expiresAt < now) {
                
                await VideoSub.findByIdAndDelete(task.VideoSubId);
                console.log(`Deleted Video Subscription with ID: ${task.VideoSubId}`);

                // Delete the task from the Scheduler
                await VideoScheduler.findByIdAndDelete(task._id);
                console.log(`Deleted Scheduler entry with ID: ${task._id}`);
            } else {
                console.log(`Task with ID ${task._id} has not expired yet.`);
            }
        }
    } catch (error) {
        console.error('Error while deleting expired subscriptions:', error);
    }
}




setInterval(deleteExpiredVideoSubscriptions, 6000);



module.exports = AdminVideoSubRoute