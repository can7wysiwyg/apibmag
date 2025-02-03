const CommentRoute = require('express').Router()
const Comment = require('../models/CommentsModel')


CommentRoute.post('/post_comment', async (req, res) => {
    try {
        const { articleName, comment, commentOwner } = req.body;

        if (!articleName || !comment || !commentOwner) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const newComment = new Comment({
            articleName: articleName, // articleId should match 'articleName' field in schema
            comment,
            commentOwner
        });

        await newComment.save();
        res.status(201).json({ msg: 'Comment posted successfully', newComment });

    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ msg: 'There was a problem making the comment' });
    }
});

// ✅ Route to get all comments for a specific article
CommentRoute.get('/get_comments/:articleId', async (req, res) => {
    try {
        const { articleId } = req.params;

        const comments = await Comment.find({ articleName: articleId }).populate('articleName', 'title'); // Populate article title

        res.status(200).json(comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ msg: 'There was a problem fetching comments' });
    }
});





module.exports = CommentRoute