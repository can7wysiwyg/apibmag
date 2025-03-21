const MagIssuesRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Magazine = require('../models/MagazineModel')


MagIssuesRoute.get("/magissueroute/show_recent_issue", asyncHandler(async(req, res, next) => {


    try {

        const newIssue = await Magazine.find.sort({_id: -1}).limit(1)


    res.json({newIssue})
    
        
    } catch (error) {
        next(error)
    }


}))



MagIssuesRoute.get("/magissueroute/show_all_issues", asyncHandler(async(req, res, next) => {


    try {

        const magIssues = await Magazine.find()


    res.json({magIssues})
    
        
    } catch (error) {
        next(error)
    }


}))


MagIssuesRoute.get("/magissueroute/show_issue_single/:id", asyncHandler(async(req, res, next) => {


    try {

        const{id} = req.params 

        const singleIssue = await Magazine.findById({_id: id})


    res.json({singleIssue})
    
        
    } catch (error) {
        next(error)
    }


}))




module.exports = MagIssuesRoute