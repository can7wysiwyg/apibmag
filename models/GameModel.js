const mongoose = require('mongoose')

const GameSchema = mongoose.Schema({

    teamOne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },

    teamTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },

    LeagueName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true
    },
    gameVenue: {
        type: String,
        required: true

    },

    gameResult: {
        type: String,
        required: true
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Game', GameSchema)
