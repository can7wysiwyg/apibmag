const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5500;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http'); // Import http for WebSocket
const WebSocket = require('ws'); // Import WebSocket
const Game = require('./models/GameModel'); // Assuming Game model is in ./models/Game

// Routes
const AdminAuthRoute = require('./adminRoutes/AdminAuthRoute');
const AdminMagaRoute = require('./adminRoutes/AdminMagaRoute');
const AdminGenreRoute = require('./adminRoutes/AdminGenreRoute');
const AdminArticleRoute = require('./adminRoutes/AdminArticleRoute');
const ArticleRoute = require('./publicRoutes/ArticleRoute');
const GenreRoute = require('./publicRoutes/GenreRoute');
const MagIssuesRoute = require('./publicRoutes/MagIssuesRoute');
const AdminVideoRoute = require('./adminRoutes/AdminVideoRoute');
const VideosRoute = require('./publicRoutes/VideosRoute');
const ReaderRoute = require('./publicRoutes/ReaderRoute');
const AdminSubRoute = require('./adminRoutes/AdminSubRoute');
const AdminVideoSubRoute = require('./adminRoutes/AdminVideoSubRoute');
const VideoSubsRoute = require('./publicRoutes/VideoSubsRoute');
const AdminSoccerRoute = require('./adminRoutes/AdminSoccerRoute');
const SoccerRoute = require('./publicRoutes/SoccerRoute');

// MongoDB connection
mongoose.connect(process.env.MONGO_DEVT_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('connected to database');
});

// Middleware
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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

// Create an HTTP server and attach WebSocket to it
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    // When a game starts
    if (data.action === 'startGame') {
      const { gameId } = data;

      // Load the game from the database
      const game = await Game.findById(gameId).populate(['teamOne', 'teamTwo', 'leagueName']);
      if (!game) {
        ws.send(JSON.stringify({ error: 'Game not found' }));
        return;
      }

      // Add the client to the list of subscribers for the game
      clients.set(ws, gameId);

      // Broadcast the initial game state to the connected client
      ws.send(JSON.stringify({ action: 'gameState', game }));

      // Optionally, you can start a timer or manage game state here
    }

    // Handle updates, goals, etc., based on future messages
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws); // Remove client from tracking
  });
});

// Broadcasting game state updates
const broadcastGameUpdate = (gameId, updatedGameData) => {
  // Send updates to all clients connected to the specific game
  clients.forEach((subscribedGameId, client) => {
    if (subscribedGameId === gameId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: 'gameUpdate', game: updatedGameData }));
    }
  });
};

// Update game state (for example, when a goal is scored)
const updateGameState = async (gameId, scoreUpdate) => {
  const game = await Game.findById(gameId);
  if (!game) return;

  // Apply score update or any other change
  game.teamOneScore = scoreUpdate.teamOneScore;
  game.teamTwoScore = scoreUpdate.teamTwoScore;
  await game.save();

  // Broadcast the updated game to all connected clients
  broadcastGameUpdate(gameId, game);
};

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
