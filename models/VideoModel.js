const mongoose = require('mongoose')

const VideosSchema = mongoose.Schema({

    videoLink: {
        type: String,
        
    },

    videoName: {
        type: String,
        required: true

    }

    

}, {
    timestamps: true
})


module.exports = mongoose.model('Video', VideosSchema)