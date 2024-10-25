const ResultRoute = require('express').Router()
const GameResult = require('../models/GameResultsModel')
const asyncHandler = require('express-async-handler')

ResultRoute.get('/results_by_league_name/:id', asyncHandler(async(req, res) => {

    try {

        const {id} = req.params

        const results = await GameResult.find({leagueName: id}).sort({_id: -1})

        res.json({results})

        
    } catch (error) {
        res.json({msg: `there was an error ${error}`})
    }


}))


module.exports = ResultRoute