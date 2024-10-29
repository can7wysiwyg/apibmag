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
      const { id } = req.params;

      const gameExists = await Game.findById(id);

      if (!gameExists) res.json({ msg: "object does not exists" });

      await Game.findByIdAndUpdate(id, req.body, { new: true });

      res.json({ msg: "successfully updated the game!" });
    } catch (error) {
      res.json({ msg: `there was an error in updating the game: ${error}` });
    }
  })
);

// END TEAM UPDATE ROUTES

module.exports = AdminSoccerRoute;
