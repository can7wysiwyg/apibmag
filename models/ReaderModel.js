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
        default: null 
    },
    expiresAt: {
        type: Date,
        default: null 
    },
    paymentMethod: {
        type: String, 
        required: true
    },
    magazineId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Magazine', 
        required: true 
    }

}, { timestamps: true });

const Reader = mongoose.model('Reader', readerSchema);

module.exports = Reader;
