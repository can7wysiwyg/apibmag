const TableRoute = require('express').Router()
const Table = require('../models/SoccerTableModel')
const asyncHandler = require('express-async-handler')


TableRoute.get('/table_get_single/:id', asyncHandler(async(req, res) => {

    try {

        const {id} = req.params

        const table = await Table.findOne({leagueId: id})

        res.json({table})
        
    } catch (error) {
        res.json({msg: `there was a problem ${error}`})
    }


}))


module.exports = TableRoute