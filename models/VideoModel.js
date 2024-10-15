const mongoose = require('mongoose')

const VideosSchema = mongoose.Schema({

    videoLink: {
        type: String,
        
    },
    videoGenre : {

        type: String,
        required: true
    },

    videoName: {
        type: String,
        required: true

    }

    

}, {
    timestamps: true
})


module.exports = mongoose.model('Video', VideosSchema)