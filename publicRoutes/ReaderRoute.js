const ReaderRoute = require('express').Router()
const Reader = require('../models/ReaderModel')
const asyncHandler = require('express-async-handler')
const Magazine = require('../models/MagazineModel')



ReaderRoute.post('/reader_credentials_submit', asyncHandler(async(req, res) => {


    try {

        const {username, email, phonenumber, transactionId, paymentMethod, magazineId } = req.body

        if(!username) res.json({msg: "username cannot be empty"})

        if(!email) res.json({msg: "email cannot be empty"})

        if(!phonenumber) res.json({msg: "phonenumber cannot be empty"})

        if(!transactionId) res.json({msg: "transaction id cannot be empty"})
       
        if(!paymentMethod) res.json({msg: "payment method cannot be empty"})



      
       await Reader.create({
        username,
        email,
        phonenumber,
        transactionId,
        paymentMethod,
        magazineId
       }) 
       
       
       res.json({msg: "you will be emailed a token to use to read the magazine.. please be patient.."})
    
    


        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }

}))


ReaderRoute.get('/reed_magazine_subscribed', asyncHandler(async(req, res) => {


    try {

        const { token } = req.body; // Retrieve the token from the request body

        if (!token) {
            return res.status(400).json({ msg: 'Token is required' });
        }
    
        const [generatedToken, magazineId] = token.split('-'); // Split the token to retrieve parts


                // Find the reader entry matching the token and magazineId
                const readerEntry = await Reader.findOne({ token: `${generatedToken}-${magazineId}` });

                // Check if the entry exists and if the token has not expired
                if (!readerEntry) {
                    return res.status(404).json({ msg: 'Access denied. Invalid token or magazine ID.' });
                }
        
                const currentTime = new Date();
                if (readerEntry.expiresAt < currentTime) {
                    return res.status(403).json({ msg: 'Access denied. Token has expired.' });
                }
        
                // If valid, fetch the magazine details using the magazineId
                const magazine = await Magazine.findById(magazineId);
                if (!magazine) {
                    return res.status(404).json({ msg: 'Magazine not found.' });
                }
        
                // Send the magazine details to the reader
                res.json({ msg: 'Access granted', magazine });
        
    


        
    } catch (error) {
        res.json({msg: `there was a problem: ${error}`})
    }


}))



module.exports = ReaderRoute