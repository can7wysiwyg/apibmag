const SoccerRoute = require('express').Router()
const Team = require('../models/TeamModel')
const League = require('../models/LeagueModel')
const Game = require('../models/GameModel')
const asyncHandler = require('express-async-handler')

// READING ALL DATA ROUTES

SoccerRoute.get('/public_show_teams', asyncHandler(async(req, res) => {

    try {

        const teams = await Team.find().sort({_id: -1})

        res.json({teams})
        
    } catch (error) {
        res.json({msg: "there was a problem " + error})
    }


}))



SoccerRoute.get('/public_show_leagues', asyncHandler(async(req, res) => {

    try {

        const leagues = await League.find().sort({_id: -1})

        res.json({leagues})
        
    } catch (error) {
        res.json({msg: "there was a problem " + error})
    }


}))


SoccerRoute.get('/public_show_games', asyncHandler(async(req, res) => {

    try {

        const games = await Game.find().sort({_id: -1})

        res.json({games})
        
    } catch (error) {
        res.json({msg: "there was a problem " + error})
    }


}))


// END READING ALL DATA



// SINGULAR DATA READING


SoccerRoute.get('/public_show_team/:id', asyncHandler(async(req, res) => {


    try {

        const {id} = req.params

        
    const team = await Team.findById(id)

    res.json({team})

        
    } catch (error) {
        res.json({msg: " there was a problem " + error})
    }
}))



SoccerRoute.get('/public_show_game/:id', asyncHandler(async(req, res) => {


    try {

        const {id} = req.params

        const game = await Game.findById(id)

        res.json({game})

        
    } catch (error) {
        res.json({msg: " there was a problem " + error})
    }
}))


SoccerRoute.get('/public_show_league/:id', asyncHandler(async(req, res) => {


    try {

        const {id} = req.params

        const league = await League.findById(id)


        res.json({league})


        
        
    } catch (error) {
        res.json({msg: " there was a problem " + error})
    }
}))





module.exports = SoccerRoute
