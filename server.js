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


let logMessages = [];
const maxLogs = 100; // Limit the number of logs stored

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    const logMessage = `Received message: ${JSON.stringify(data)}`;
    console.log(logMessage);
    
    // Store the log message
    logMessages.push(logMessage);
    if (logMessages.length > maxLogs) {
      logMessages.shift(); // Remove the oldest log if limit is reached
    }

    if (data.action === 'startGame') {
      const { gameId } = data;
      console.log(`Client subscribed to game ID: ${gameId}`);
      logMessages.push(`Client subscribed to game ID: ${gameId}`);
      if (logMessages.length > maxLogs) {
        logMessages.shift(); // Remove the oldest log if limit is reached
      }

      clients.set(ws, gameId);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws);
  });
});

// API route to get log messages
app.get('/api/logs', (req, res) => {
  res.json(logMessages);
});





// Handle WebSocket connections

// wss.on('connection', (ws) => {
//   console.log('New WebSocket connection established');

//   ws.on('message', async (message) => {
//     const data = JSON.parse(message);
//      console.log(`Received message: ${JSON.stringify(data)}`)

    


    

//     if (data.action === 'startGame') {
//       const { gameId } = data;
//       console.log(`Client subscribed to game ID: ${gameId}`);

      
//       clients.set(ws, gameId);

      
//     }

    
//   });

//   ws.on('close', () => {
//     console.log('WebSocket connection closed');
//     clients.delete(ws);
//   });
// });




// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});