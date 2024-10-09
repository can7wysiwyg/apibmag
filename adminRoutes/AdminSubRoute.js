const AdminSubRoute = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const Reader = require('../models/ReaderModel')
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




AdminSubRoute.post('/admin_generate_token', verifyAdmin, authAdmin,  asyncHandler(async(req, res) => {

    try {
        const { transactionId, magazineId  } = req.body;

        const randomToken = crypto.randomBytes(16).toString('hex'); 
        const token = `${randomToken}-${magazineId}`; 
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2); 

        
        const updatedReader = await Reader.findOneAndUpdate(
            { transactionId }, 
            { token, expiresAt, magazineId }, 
            { new: true } 
        );

        if (!updatedReader) {
            return res.json({ msg: 'Reader not found' });
        }

        
        res.json({ msg: 'Token generated successfully', token, expiresAt });


        

        



        
    } catch (error) {
        res.json({msg: `there was an error ${error}`})
    }


}))


module.exports = AdminSubRoute