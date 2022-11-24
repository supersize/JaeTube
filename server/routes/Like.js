const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

const { auth } = require("../middleware/auth");
//=================================
//             Like
//=================================

/**
 * getting a comment list.
 * 
 */
router.post("/likes", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    Like.find(param)
        .exec((err, likes) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            return res.status(200).json({ success: true, likes})
        });
});


router.post("/dislikes", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    Dislike.find(param)
        .exec((err, dislikes) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            return res.status(200).json({ success: true, dislikes})
        });
});


router.post("/upLike", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    const like = new Like(param);
    like.save((err, likeResult) => {
        if(err) {
            return res.status(400).json({success: false, err})
        }

        Dislike.findOneAndDelete(param)
            .exec((err, dislikeResult) => {
                if(err) {
                    return res.status(400).json({success: false, err})
                }
    
                return res.status(200).json({ success: true, likeResult})
            });
    }) 

});


router.post("/unlike", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    Like.findOneAndDelete(param)
        .exec((err, likeResult) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            return res.status(200).json({ success: true, likeResult})
        });

});


router.post("/upDislike", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    const dislike = new Dislike(param);
    dislike.save((err, dislikeResult) => {
        if(err) {
            return res.status(400).json({success: false, err})
        }

        Like.findOneAndDelete(param)
            .exec((err, likeResult) => {
                if(err) {
                    return res.status(400).json({success: false, err})
                }
    
                return res.status(200).json({ success: true, dislikeResult})
            });
    }) 

});


router.post("/unDislike", (req, res) => {
    let param = {
        userId: req.body.userId
    }

    if (req.body.videoId) {
        param.videoId = req.body.videoId
    }
    else if (req.body.commentId) {
        param.commentId = req.body.commentId
    }

    Dislike.findOneAndDelete(param)
        .exec((err, dislikeResult) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            return res.status(200).json({ success: true, dislikeResult})
        });

});



module.exports = router;
