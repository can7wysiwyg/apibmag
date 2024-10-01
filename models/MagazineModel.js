const mongoose = require('mongoose')

const MagazineModel = mongoose.Schema({

    magazineIssue: {
        type: String,
        unique: true,
        required: true
    },

    magazinePhoto: {
        type: String,
        
    },
    magazinePdfFile: {
        type: String,
        
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Magazine', MagazineModel)