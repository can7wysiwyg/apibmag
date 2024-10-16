const mongoose = require('mongoose')


const TeamSchema = mongoose.Schema({

    teamName: {
        type: String,
        unique: true,
        required: true
    },
    teamLocation: {
        type: String,
        required: true
    },



}, {
    timestamps: true
})


module.exports = mongoose.model('Team', TeamSchema)