const mongoose = require('mongoose');

const GameResultsSchema = mongoose.Schema({
    leagueName: {
        type: String,
        required: true,
    },
    teamOne: {
        name: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 0, // Default score is 0
        },
        scorers: {
            type: [String], // Array of strings for scorers' names
            default: [],
        },
    },
    teamTwo: {
        name: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 0, // Default score is 0
        },
        scorers: {
            type: [String], // Array of strings for scorers' names
            default: [],
        },
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('GameResult', GameResultsSchema);

