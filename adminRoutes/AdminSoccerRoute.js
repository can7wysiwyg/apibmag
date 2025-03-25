const AdminSoccerRoute = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require("../middleware/authAdmin");
const Team = require("../models/TeamModel");
const League = require("../models/LeagueModel");
const Game = require("../models/GameModel");
const asyncHandler = require("express-async-handler");

// CREATE ROUTES

AdminSoccerRoute.post(
  "/admin_create_team",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { teamName, teamLocation } = req.body;

      if (!teamName || !teamLocation)
        res.json({ msg: "check the input boxes for missing values" });

      await Team.create({
        teamName,
        teamLocation,
      });

      res.json({ msg: "successfully created a team!" });
    } catch (error) {
      res.json({ msg: `there was an error in creating the team: ${error}` });
    }
  })
);

AdminSoccerRoute.post(
  "/admin_create_league",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { startDate, endDate, leagueName, hasLogTable } = req.body;

      if (!endDate || !startDate || !leagueName || !hasLogTable)
        res.json({ msg: "check for blank input boxes" });

      await League.create({
        leagueName,
        startDate,
        endDate,
        hasLogTable,
      });

      res.json({ msg: "successfully created a new league" });
    } catch (error) {
      res.json({ msg: `there was an error in creating the league: ${error}` });
    }
  })
);

AdminSoccerRoute.post("/admin_create_game",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const fixtures = req.body;

      for (const fixture of fixtures) {
        const { teamOne, teamTwo, leagueName, gameTime, gameVenue } = fixture;

        if (!gameVenue || !teamOne || !teamTwo || !leagueName || !gameTime) {
          return res.json({ msg: "All fields are required." });
        }

        // Find or create a league document by name
        let league = await Game.findOne({ leagueName });
        
        // If no league found, create a new league document
        if (!league) {
          league = new Game({ leagueName, games: [] });
        }

        // Create a new game entry
        const newGame = {
          teamOne,
          teamTwo,
          gameVenue,
          gameTime,
          leagueName,
        };

        // Push new game to the games array
        league.games.push(newGame);

        // Save the updated league document
        await league.save();

        
      }

      res.json({ msg: "Successfully created new football matches!" });
    } catch (error) {
      res.json({
        msg: `There was an error creating the games: ${error.message}`,
      });
    }
  })
);



//    END CREATE ROUTES

// UPDATE ROUTES

AdminSoccerRoute.put(
  "/admin_team_update/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const teamExists = await Team.findById(id);

      if (!teamExists) res.json({ msg: "object does not exists" });

      await Team.findByIdAndUpdate(id, req.body, { new: true });

      res.json({ msg: "successfully updated the team!" });
    } catch (error) {
      res.json({ msg: `there was an error in updating the team: ${error}` });
    }
  })
);

AdminSoccerRoute.put(
  "/admin_league_update/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const leagueExists = await League.findById(id);

      if (!leagueExists) res.json({ msg: "object does not exists" });

      await League.findByIdAndUpdate(id, req.body, { new: true });

      res.json({ msg: "successfully updated the league!" });
    } catch (error) {
      res.json({ msg: `there was an error in updating the league: ${error}` });
    }
  })
);


AdminSoccerRoute.put(
  "/admin_game_update/:id",
  verifyAdmin,
  authAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params; // The ID of the game to be updated
      const updateData = req.body; // The data to update the game with

      // Find the parent document containing the game to be updated
      const gameDocument = await Game.findOne({ "games._id": id });

      if (!gameDocument) {
        return res.json({ msg: "Game does not exist" });
      }

      // Update the specific game in the games array
      const updatedGame = await Game.updateOne(
        { "games._id": id }, // Find the document with the specific game ID
        { $set: { "games.$": updateData } }, // Use $set to update the specific game
        { new: true } // This option does not apply to updateOne but is here for reference
      );

      if (updatedGame.modifiedCount === 0) {
        return res.json({ msg: "No changes made" });
      }

      res.json({ msg: "Successfully updated the game!" });
    } catch (error) {
      res.json({ msg: `There was an error in updating the game: ${error.message}` });
    }
  })
);



// END TEAM UPDATE ROUTES


// DELETE ROUTES

AdminSoccerRoute.delete('/admin_erase_game/:id', verifyAdmin, authAdmin,   asyncHandler(async(req, res) => {

   
  try {

    const { id } = req.params;

    // Find the document that contains the specific game to delete
    const gameDocument = await Game.findOne({ "games._id": id });

    if (!gameDocument) {
      return res.json({ msg: "Game not found" });
    }

    // Remove the specific game from the games array
    await Game.findOneAndUpdate(
      { "games._id": id }, // Query to find the correct document
      { $pull: { games: { _id: id } } } // Remove the game from the array
    );

    res.json({ msg: "Successfully deleted the game!" });


    
  } catch (error) {
    res.json({msg: `there was an error: ${error}`})
  }


}))

AdminSoccerRoute.delete(`/admin_erase_team/:id`, verifyAdmin, authAdmin, async(req, res) => {

  try {

    const {id} = req.params

    await Team.findByIdAndDelete(id)

    res.json({msg: "successfully deleted"})

    
  } catch (error) {
    res.json({msg: "failure deleting team"})
  }


})


AdminSoccerRoute.delete(`/admin_erase_league/:id`, verifyAdmin, authAdmin, async(req, res) => {

  try {

    const {id} = req.params

    await League.findByIdAndDelete(id)

    await Game.deleteMany({
      leagueName: id
    })

    

    res.json({msg: "successfully deleted"})
    
    
  } catch (error) {
    res.json({msg: "failure deleting league"})
  }


})


module.exports = AdminSoccerRoute;
