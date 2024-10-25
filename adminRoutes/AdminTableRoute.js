const AdminTableRoute = require('express').Router()
const Table = require('../models/SoccerTableModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const asyncHandler = require('express-async-handler')


AdminTableRoute.post('/admin_soccer_table_create', verifyAdmin, authAdmin, asyncHandler(async (req, res) => {
    try {

        
        const { leagueId, teamIds } = req.body;



        if (!leagueId) return res.json({ msg: "League ID is missing" });
        if (!teamIds || !Array.isArray(teamIds)) return res.json({ msg: "Team IDs must be an array" });

        // Create an array of team stats
        const teams = teamIds.map(teamId => ({
            teamId,
            points: 0, // Initialize other stats as needed
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
        }));

        // Create a new entry for the table
        const tableEntry = new Table({
            leagueId,
            teams,
        });

    

         await tableEntry.save(); // Save the entire table entry
        res.json({msg: "successfully created table"});

    } catch (error) {
        res.json({ msg: "There was a problem in creating the table: " + error });
    }
}));



module.exports = AdminTableRoute