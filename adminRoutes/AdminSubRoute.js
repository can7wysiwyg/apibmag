const AdminSubRoute = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const Reader = require('../models/ReaderModel')
const Scheduler = require('../models/ScheduledTaskModel')
const asyncHandler = require('express-async-handler')
const crypto  = require('crypto')





AdminSubRoute.get('/admin_check_subscriptions_all', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {


    try {

        const subscriptions = await Reader.find().sort({_id: -1})


        res.json({subscriptions})

        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }


}))




AdminSubRoute.get('/admin_check_subscription_single/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

    try {

        const {id} = req.params

        const subscription = await Reader.findById(id)

        res.json({subscription})
        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }



}) )



AdminSubRoute.post('/admin_generate_token', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {
    try {
        const { transactionId, magazineId } = req.body;

        const randomToken = crypto.randomBytes(16).toString('hex');
        const token = `${randomToken}-${magazineId}`;
        const expiresAt = new Date();
        // expiresAt.setDate(expiresAt.getDate() + 7); 
        expiresAt.setMinutes(expiresAt.getMinutes() + 15)


        const updatedReader = await Reader.findOneAndUpdate(
            { transactionId },
            { token, expiresAt, magazineId },
            { new: true }
        );

        if (!updatedReader) {
            return res.json({ msg: 'Reader not found' });
        }

        
        await Scheduler.create({
            ReaderId: updatedReader._id,
            expiresAt
        });

        res.json({ token, expiresAt, magazineId });
    } catch (error) {
        res.json({ msg: `There was an error: ${error}` });
    }
}));


async function deleteExpiredSubscriptions() {
    try {
        const now = new Date();

        
        const allTasks = await Scheduler.find();

        if (allTasks.length === 0) {
            console.log("No tasks found.");
            return;
        }

        
        for (const task of allTasks) {
            const expiresAt = new Date(task.expiresAt); 

            

            
            if (expiresAt < now) {
                
                await Reader.findByIdAndDelete(task.ReaderId);
                console.log(`Deleted Reader with ID: ${task.ReaderId}`);

                // Delete the task from the Scheduler
                await Scheduler.findByIdAndDelete(task._id);
                console.log(`Deleted Scheduler entry with ID: ${task._id}`);
            } else {
                console.log(`Task with ID ${task._id} has not expired yet.`);
            }
        }
    } catch (error) {
        console.error('Error while deleting expired subscriptions:', error);
    }
}




setInterval(deleteExpiredSubscriptions, 6000);




module.exports = AdminSubRoute