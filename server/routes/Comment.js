const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");
//=================================
//             Comment
//=================================

/**
 * getting a comment list.
 * 
 */
router.post("/commentList", (req, res) => {
    Comment.find({videoId : req.body.videoId})
        .populate('writer')
        .exec((err, commentList) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            return res.status(200).json({ success: true, commentList})
        });
});

/**
 * saving a comment object.
 * 
 */
router.post("/saveComment", (req, res) => {
    const comment = new Comment(req.body)
    comment.save((err, comment) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            Comment.find({_id: comment._id})
                .populate('writer')
                .exec((err, result) => {
                    if(err) {
                        return res.status(400).json({success: false, err})
                    }

                    return res.status(200).json({ success: true, result})
                })
                

            // return res.status(200).json({ success: true, comment})
        })
});

module.exports = router;
