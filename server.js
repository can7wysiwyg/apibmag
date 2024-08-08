const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port  = process.env.PORT || 5500
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const AdminAuthRoute = require('./adminRoutes/AdminAuthRoute')
const AdminMagaRoute = require('./adminRoutes/AdminMagaRoute')
const AdminGenreRoute = require('./adminRoutes/AdminGenreRoute')


mongoose.connect(process.env.MONGO_DEVT_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("connected to database");
  });


  app.use(cors())

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

  
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({extended: true, limit: '50mb'}))
  app.use(cookieParser())
  app.use(fileUpload({
    useTempFiles: true
}))


// api routes

app.use(AdminAuthRoute)
app.use(AdminMagaRoute)
app.use(AdminGenreRoute)



app.listen(port, () => {
    console.log(`Your server is now running on port ${port}`);
})

  


