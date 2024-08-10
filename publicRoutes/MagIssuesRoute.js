const MagIssuesRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Magazine = require('../models/MagazineModel')


MagIssuesRoute.get("/magissueroute/show_recent_issue", asyncHandler(async(req, res, next) => {


    try {

        const newIssue = await Magazine.find().sort({_id: -1}).limit(1)


    res.json({newIssue})
    
        
    } catch (error) {
        next(error)
    }


}))



module.exports = MagIssuesRoute