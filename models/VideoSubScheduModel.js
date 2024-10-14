const mongoose = require('mongoose');

const VideoSchedulerSchema = mongoose.Schema({
    VideoSubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VideoSub"
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VideoScheduler', VideoSchedulerSchema);
