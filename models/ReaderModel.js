const mongoose = require('mongoose');
const { Schema } = mongoose;

const readerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null // Token is generated later, so it's not required initially
    },
    expiresAt: {
        type: Date,
        default: null // Expiration date will be set once the token is generated
    },
    paymentMethod: {
        type: String, // Either 'TNM Mpamba' or 'AirtelMoney'
        required: true
    },
    magazineId: { // New field added
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Magazine', // Reference to your Magazine model
        required: true // Make it required if every subscription should be tied to a magazine
    }

}, { timestamps: true });

const Reader = mongoose.model('Reader', readerSchema);

module.exports = Reader;
