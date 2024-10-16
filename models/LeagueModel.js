const mongoose = require('mongoose')

const LeagueSchema = mongoose.Schema({

    leagueName: {
        type: String,
        unique: true,
        required: true
    },
    leagueDuration: {
        type: String,
        required: true 
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('League', LeagueSchema)