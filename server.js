const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5500;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const http = require("http"); // Import http for WebSocket
const WebSocket = require("ws"); // Import WebSocket
const Game = require("./models/GameModel"); // Assuming Game model is in ./models/Game
const asyncHandler = require("express-async-handler");
const GameResult = require("./models/GameResultsModel");

// Routes
const AdminAuthRoute = require("./adminRoutes/AdminAuthRoute");
const AdminMagaRoute = require("./adminRoutes/AdminMagaRoute");
const AdminGenreRoute = require("./adminRoutes/AdminGenreRoute");
const AdminArticleRoute = require("./adminRoutes/AdminArticleRoute");
const ArticleRoute = require("./publicRoutes/ArticleRoute");
const GenreRoute = require("./publicRoutes/GenreRoute");
const MagIssuesRoute = require("./publicRoutes/MagIssuesRoute");
const AdminVideoRoute = require("./adminRoutes/AdminVideoRoute");
const VideosRoute = require("./publicRoutes/VideosRoute");
const ReaderRoute = require("./publicRoutes/ReaderRoute");
const AdminSubRoute = require("./adminRoutes/AdminSubRoute");
const AdminVideoSubRoute = require("./adminRoutes/AdminVideoSubRoute");
const VideoSubsRoute = require("./publicRoutes/VideoSubsRoute");
const AdminSoccerRoute = require("./adminRoutes/AdminSoccerRoute");
const SoccerRoute = require("./publicRoutes/SoccerRoute");
const AdminTableRoute = require("./adminRoutes/AdminTableRoute");
const TableRoute = require("./publicRoutes/TableRoute");
const ResultRoute = require("./publicRoutes/ResultRoute");

// MongoDB connection
mongoose.connect(process.env.MONGO_DEVT_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("connected to database");
});

// Middleware
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// API Routes
app.use(AdminAuthRoute);
app.use(AdminMagaRoute);
app.use(AdminGenreRoute);
app.use(AdminArticleRoute);
app.use(ArticleRoute);
app.use(GenreRoute);
app.use(MagIssuesRoute);
app.use(AdminVideoRoute);
app.use(VideosRoute);
app.use(ReaderRoute);
app.use(AdminSubRoute);
app.use(AdminVideoSubRoute);
app.use(VideoSubsRoute);
app.use(AdminSoccerRoute);
app.use(SoccerRoute);
app.use(AdminTableRoute)
app.use(TableRoute)
app.use(ResultRoute)

// Create an HTTP server and attach WebSocket to it
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

let logMessages = [];
const maxLogs = 100; // Limit the number of logs stored

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    // Store the log message
    const logMessage = JSON.stringify(data);

    logMessages.push(logMessage);
    if (logMessages.length > maxLogs) {
      logMessages.shift(); // Remove the oldest log if limit is reached
    }

    // Handle game actions (start, pause, resume, end)
    const { action, gameId } = data;

    if (action === "startGame") {
      clients.set(ws, gameId);
      if (!gameTimers[gameId]) {
        gameTimers[gameId] = {
          startTime: new Date(),
          paused: false,
          elapsedTime: 0, // Initialize elapsed time
        };
      }
    }

    // Pause the game
    else if (action === "pauseGame") {
      const gameTimer = gameTimers[gameId];
      if (gameTimer && !gameTimer.paused) {
        const elapsedTime =
          new Date() - gameTimer.startTime + (gameTimer.elapsedTime || 0); // Calculate elapsed time
        gameTimers[gameId].paused = true;
        gameTimers[gameId].elapsedTime = elapsedTime; // Store elapsed time
        console.log(`Game ${gameId} paused at ${elapsedTime / 1000} seconds`);
      }
    }

    // Resume the game
    else if (action === "resumeGame") {
      const gameTimer = gameTimers[gameId];
      if (gameTimer && gameTimer.paused) {
        gameTimers[gameId].paused = false;
        gameTimers[gameId].startTime = new Date(); // Reset start time for resuming
        console.log(`Game ${gameId} resumed`);
      }
       }

     else if (action === "endGame") {
      const { gameId } = data; // Extract the game ID from the incoming data
  
      // Fetch all games
      const games = await Game.find(); 
  
      // Find the specific game that needs to be processed
      const singleGame = games.flatMap(game => game.games).find(item => item._id.toString() === gameId);
      
      if (singleGame) {
          const { leagueName } = singleGame; 
  
          // Initialize teams' structures
          const teamOne = {
              name: singleGame.teamOne, // Replace with actual reference to team name
              score: 0,
              scorers: [],
          };
  
          const teamTwo = {
              name: singleGame.teamTwo, // Replace with actual reference to team name
              score: 0,
              scorers: [],
          };
  
          // Process log messages to get scores and scorers
          logMessages.forEach((log) => {
              const message = JSON.parse(log);
  
              if (message.action === "updateGoals" && message.gameId === gameId) {
                  // Update scores and scorers based on log message
                  teamOne.score = message.teamOneScore;
                  teamTwo.score = message.teamTwoScore;
                  teamOne.scorers.push(...message.teamOneScorers); // Add scorers
                  teamTwo.scorers.push(...message.teamTwoScorers);
              }
          });
  
          // Save to the new GameResult model
          const gameResult = new GameResult({
              leagueName,
              teamOne,
              teamTwo,
          });
  
          await gameResult.save();
  
          // Now remove the game from the parent document
          await Game.updateMany(
              {}, // Update the first document found
              { $pull: { games: { _id: gameId } } } // Pull the game from the games array
          );
  
          console.log(`Game ${gameId} results saved and game deleted.`);
      } else {
          console.log(`Game ${gameId} not found.`);
      }
  }
  



 }

);

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clients.delete(ws);
  });
});

app.get("/api/logs", (req, res) => {
  res.json(logMessages);
});

let gameTimers = {};

function getElapsedTime(gameTimer) {
  if (gameTimer.paused) {
    return formatElapsedTime(gameTimer.elapsedTime);
  }

  const currentTime = new Date();
  const diffMs =
    currentTime - gameTimer.startTime + (gameTimer.elapsedTime || 0); // Include previously elapsed time
  return formatElapsedTime(diffMs);
}

function formatElapsedTime(ms) {
  const diffSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

// // Polling API to return game times
app.get("/api/game_times", (req, res) => {
  // Process log messages and start timers if not already running
  logMessages.forEach((log) => {
    try {
      // Ensure log is a string
      if (typeof log !== "string") {
        throw new Error("Log message is not a string");
      }

      // Check if the log message starts with the expected prefix
      if (!log.startsWith("Received message: ")) {
        return; // Skip to the next iteration
      }

      const parts = log.split("Received message: ");
      // console.log('Split parts:'); // Log the split parts

      // Check if we have a valid message part
      if (parts.length < 2 || !parts[1]) {
        throw new Error("Log message part is undefined or malformed");
      }

      const message = JSON.parse(parts[1]);

      // If action is "startGame", start the timer for that game
      if (message.action === "startGame" && !gameTimers[message.gameId]) {
        gameTimers[message.gameId] = {
          startTime: new Date(),
          gameId: message.gameId,
        };
      }
    } catch (error) {
      console.log("Error parsing log message:");
    }
  });

  const gameUpdates = Object.keys(gameTimers).map((gameId) => {
    const gameTimer = gameTimers[gameId];
    return {
      gameId: gameId,
      elapsedTime: getElapsedTime(gameTimer), // Use the new function to calculate time
    };
  });

  // Send the game updates (with elapsed time) to the frontend
  res.json(gameUpdates);
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
