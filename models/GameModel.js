const mongoose = require('mongoose');

// Define the Game subdocument schema
const compSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    
}, { _id: true });

// Define the League schema with games as an array of GameSchema
const gameSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true
    },
    games: [compSchema]  // Embed GameSchema as an array within the LeagueSchema
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
