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

    leagueName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true
    },
    gameVenue: {
        type: String,
        required: true

    },
    gameTime: {
        type: Date,
        required: true

    },

    gameResult: {
        type: String,
        default: null
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Game', GameSchema)
