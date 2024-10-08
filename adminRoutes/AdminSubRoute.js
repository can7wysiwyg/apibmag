const AdminSubRoute = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const Reader = require('../models/ReaderModel')
const asyncHandler = require('express-async-handler')
const crypto  = require('crypto')


AdminSubRoute.get('/admin_check_reader/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

    try {

        const {id} = req.params

        const singleReader = await Reader.findById(id)

        res.json({singleReader})
        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }



}) )




AdminSubRoute.post('/admin_generate_token', verifyAdmin, authAdmin,  asyncHandler(async(req, res) => {

    try {
        const { transactionId, magazineId  } = req.body;

        const randomToken = crypto.randomBytes(16).toString('hex'); // Generates a 32-character hex token
        const token = `${randomToken}-${magazineId}`; // Create a composite token
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2); // Set expiration to two hours from now

        // Update the Reader entry with the generated token, expiration date, and magazine ID
        const updatedReader = await Reader.findOneAndUpdate(
            { transactionId }, // Find by transaction ID
            { token, expiresAt, magazineId }, // Update fields
            { new: true } // Return the updated document
        );

        if (!updatedReader) {
            return res.status(404).json({ msg: 'Reader not found' });
        }

        // Optionally: Send the token via email or SMS here

        // Respond with a success message
        res.json({ msg: 'Token generated successfully', token, expiresAt });


        

        



        
    } catch (error) {
        res.json({msg: `there was an error ${error}`})
    }


}))


module.exports = AdminSubRoute