const AdminComments = require('express').Router()
const Comment = require('../models/CommentsModel')
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require("../middleware/authAdmin");


AdminComments.get('/admin/view_article_comments/:id', verifyAdmin, authAdmin, async(req, res) => {

    try {

        const {id} = req.params

        if(!id) {
            return res.json({msg: "No Id Provided"})
        }

        const comments = await Comment.find({articleName: id})

        if(!comments) {
            return res.json({msg: "No comments found"})
        }
        
        res.json({comments})


    } catch (error) {
        res.json({msg: "Server Error"})
    }

})

AdminComments.delete('/admin/erase_comment/:id', verifyAdmin, authAdmin, async(req, res) => {

try {
      const {id} = req.params

        if(!id) {
            return res.json({msg: "No Id Provided"})
        }

        await Comment.findByIdAndDelete(id)

        res.json({msg: "Deleted Comment"})

    
} catch (error) {
    res.json({msg: "Server Error"})
}

})

module.exports = AdminComments