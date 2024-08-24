const mongoose = require('mongoose')

const MagazineModel = mongoose.Schema({

    magazineIssue: {
        type: String,
        unique: true,
        required: true
    },

    magazinePhoto: {
        type: String,
        required: true
    },
    magazinePdfFile: {
        type: String,
        required: true
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Magazine', MagazineModel)