const ReaderRoute = require('express').Router()
const Reader = require('../models/ReaderModel')
const asyncHandler = require('express-async-handler')
const Magazine = require('../models/MagazineModel')
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
        from: process.env.EMAIL_USER, 
        to: 'paulkssa@gmail.com', 
        subject: 'New Magazine Subscription Alert',
        text: `A new magazine subscription has been made by ${username}.\nEmail: ${email}.\nPhone Number: ${phonenumber}\nTransaction ID: ${transactionId}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to admin successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

ReaderRoute.post('/reader_credentials_submit', asyncHandler(async (req, res) => {
    try {
        const { username, email, phonenumber, transactionId, paymentMethod, magazineId } = req.body;

        // Validation
        if (!username) return res.json({ msg: "username cannot be empty" });
        if (!email) return res.json({ msg: "email cannot be empty" });
        if (!phonenumber) return res.json({ msg: "phonenumber cannot be empty" });
        if (!transactionId) return res.json({ msg: "transaction id cannot be empty" });
        if (!paymentMethod) return res.json({ msg: "payment method cannot be empty" });

        // Create Reader
         await Reader.create({
            username,
            email,
            phonenumber,
            transactionId,
            paymentMethod,
            magazineId
        });

        // Send email to admin
        await sendEmailToAdmin(username, email, phonenumber, transactionId);

        // Response
        res.json({ msg: "You will be emailed a token to use to read the magazine.. please be patient.." });

    } catch (error) {
        res.json({ msg: `There was a problem ${error}` });
    }
}));





ReaderRoute.post('/reed_magazine_subscribed', asyncHandler(async(req, res) => {


    try {

        const { token } = req.body; 

        if (!token) {
            return res.json({ msg: 'Token is required' });
        }
    
        const [generatedToken, magazineId] = token.split('-'); 


                
                const readerEntry = await Reader.findOne({ token: `${generatedToken}-${magazineId}` });

                
                if (!readerEntry) {
                    return res.json({ msg: 'Access denied. Invalid token or magazine ID.' });
                }
        
                const currentTime = new Date();
                if (readerEntry.expiresAt < currentTime) {
                    return res.json({ msg: 'Access denied. Token has expired.' });
                }
        
                
                const magazine = await Magazine.findById(magazineId);
                if (!magazine) {
                    return res.json({ msg: 'Magazine not found.' });
                }
        
                
                res.json({magazine, readerEntry});
        
    


        
    } catch (error) {
        res.json({msg: `there was a problem: ${error}`})
    }


}))


ReaderRoute.get('/find_by_token/:token', asyncHandler(async(req, res) => {

try {

    const {token} = req.params

    const item = await Reader.findOne({token})

    res.json({item})


    
} catch (error) {
    res.json({msg: `there was a problem: ${error}`})
    
}

}))



module.exports = ReaderRoute