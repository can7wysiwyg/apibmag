const mongoose = require('mongoose')

const LeagueSchema = mongoose.Schema({

    leagueName: {
        type: String,
        unique: true,
        required: true
    },
    startDate: {
        type: String,
        required: true 
    },
    endDate: {
        type: String,
        required: true 
    },
    hasLogTable: {
        type: Boolean,
         default: false
    }


}, {
    timestamps: true
})


module.exports = mongoose.model('League', LeagueSchema)