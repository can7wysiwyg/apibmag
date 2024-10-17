const AdminSoccerRoute = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const Team = require('../models/TeamModel')
const League = require('../models/LeagueModel')
const Game = require('../models/GameModel')
const asyncHandler = require('express-async-handler')

// CREATE ROUTES

AdminSoccerRoute.post('/admin_create_team',
     verifyAdmin, 
     authAdmin, 
    asyncHandler(async(req, res) => {

try {

    const {teamName, teamLocation} = req.body

    if(!teamName || !teamLocation) res.json({msg: "check the input boxes for missing values"})
        
        await Team.create({
            teamName,
            teamLocation
        })


        res.json({msg: "successfully created a team!"})
    
} catch (error) {
    res.json({msg: `there was an error in creating the team: ${error}`})
}


    }) )



    AdminSoccerRoute.post('/admin_create_league',
        verifyAdmin, 
        authAdmin, 
       asyncHandler(async(req, res) => {   
   try {

    const {startDate, endDate, leagueName} = req.body

    if(!endDate || !startDate || !leagueName) res.json({msg: "check for blank input boxes"})


        await League.create({
            leagueName,
            startDate,
            endDate
        })

        res.json({msg: "successfully created a new league"})
       
   } catch (error) {
       res.json({msg: `there was an error in creating the league: ${error}`})
   }
   
   
       }) )



    
       AdminSoccerRoute.post('/admin_create_game',
        verifyAdmin, 
        authAdmin, 
       asyncHandler(async(req, res) => {
   
   try {

    const {teamOne, teamTwo, leagueName, gameTime, gameVenue} = req.body

    if(!gameVenue || !teamOne || !teamTwo || !leagueName  || !gameTime) res.json({msg: "cannot be blank"})


        await Game.create({
            teamOne,
            teamTwo,
            leagueName,
            gameVenue,
            gameTime
        })


        res.json({msg: "succesfuuly created a new football match!"})
       
   } catch (error) {
       res.json({msg: `there was an error in creating the game: ${error}`})
   }
   
   
       }) )


    //    END CREATE ROUTES


    // UPDATE ROUTES


    AdminSoccerRoute.put('/admin_team_update/:id', 
        verifyAdmin,
         authAdmin,
         asyncHandler(async(req, res) => {

try {

    const {id} = req.params 

    const teamExists = await Team.findById(id)

    if(!teamExists) res.json({msg: "object does not exists"})

    await Team.findByIdAndUpdate(id, req.body, {new: true})    


    res.json({msg: "successfully updated the team!"})

    
} catch (error) {
    res.json({msg: `there was an error in updating the team: ${error}`})
}


         }))


         AdminSoccerRoute.put('/admin_league_update/:id', 
            verifyAdmin,
             authAdmin,
             asyncHandler(async(req, res) => {
    
    try {
    
        const {id} = req.params

        const leagueExists = await League.findById(id)

    if(!leagueExists) res.json({msg: "object does not exists"})

    await League.findByIdAndUpdate(id, req.body, {new: true})    


    res.json({msg: "successfully updated the league!"})

    
    
        
    } catch (error) {
        res.json({msg: `there was an error in updating the league: ${error}`})
    }
    
    
             }))


             AdminSoccerRoute.put('/admin_game_update/:id', 
                verifyAdmin,
                 authAdmin,
                 asyncHandler(async(req, res) => {
        
        try {
        
            const {id} = req.params

            const gameExists = await Game.findById(id)

    if(!gameExists) res.json({msg: "object does not exists"})

    await Game.findByIdAndUpdate(id, req.body, {new: true})    


    res.json({msg: "successfully updated the game!"})

        
        
            
        } catch (error) {
            res.json({msg: `there was an error in updating the game: ${error}`})
        }
        
        
                 }))



  // END TEAM UPDATE ROUTES  
        
                    
    
    


module.exports = AdminSoccerRoute