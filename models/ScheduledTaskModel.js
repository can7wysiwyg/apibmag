const mongoose = require('mongoose');

const SchedulerSchema = mongoose.Schema({
    ReaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reader"
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Scheduler', SchedulerSchema);
