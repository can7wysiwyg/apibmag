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

AdminTableRoute.put("/update_table/:id", verifyAdmin, authAdmin, asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // This is the leagueId
        const { teams } = req.body; // Array of updated team data

        // Find the league table by its leagueId
        const leagueTable = await Table.findOne({ leagueId: id });
        if (!leagueTable) return res.json({ msg: "League table not found" });

        console.log(teams)

        // Update teams based on the incoming data
        leagueTable.teams = teams.map((updatedTeam) => {
            const existingTeam = leagueTable.teams.find(team => team._id.toString() === updatedTeam._id);

            if (existingTeam) {
                existingTeam.gamesPlayed = updatedTeam.gamesPlayed;
                existingTeam.wins = updatedTeam.wins;
                existingTeam.draws = updatedTeam.draws;
                existingTeam.losses = updatedTeam.losses;
                existingTeam.goalsFor = updatedTeam.goalsFor;
                existingTeam.goalsAgainst = updatedTeam.goalsAgainst;
                existingTeam.goalDifference = updatedTeam.goalsFor - updatedTeam.goalsAgainst;
                existingTeam.points = updatedTeam.points;
            }
            return existingTeam || updatedTeam; 
        });

        await leagueTable.save();
        res.json({ msg: "League table updated successfully" });
    } catch (error) {
        res.json({ msg: `There was a problem: ${error.message}` });
    }
}));


AdminTableRoute.delete(`/erase_table_admin/:id`, verifyAdmin, authAdmin, async(req, res) => {

    try {

        const {id} = req.params

        await Table.findByIdAndDelete(id)

        res.json({msg: "Table deleted successfully"})
        
    } catch (error) {
        res.json({msg: `failure to delete table ${error}`})
    }


})


module.exports = AdminTableRoute