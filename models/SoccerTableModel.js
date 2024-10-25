const mongoose = require('mongoose');

const TeamStatsSchema = mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
});

const SoccerTableSchema = mongoose.Schema({
    leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true }, // Reference to the League
    teams: [TeamStatsSchema], // Array of team stats for this league
}, {
    timestamps: true
});

module.exports = mongoose.model('Table', SoccerTableSchema);
