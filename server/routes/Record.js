const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Record } = require("../models/Record");

const { auth } = require("../middleware/auth");
//=================================
//             Record
//=================================

/**
 * getting a record list.
 * 
 */
router.post("/getMyVideoViewedRecordList", (req, res) => {
    console.log("req.body!!", req.body);
    Record.find({viewerId : req.body.userId})
        .sort({updatedAt : -1})
        // .populate('video', populate('writer'))
        .populate({path : 'video', populate : {path : 'writer'}})
        .exec((err, recordList) => {
            if(err) {
                return res.status(400).json({success: false, err})
            }

            console.log("resutl : ", recordList);
            return res.status(200).json({ success: true, recordList})
        });
});

/**
 * saving a record object.
 * 
 */
 router.post('/saveRecord', auth, (req, res) => {
    const record = new Record(req.body)
    Record.findOneAndUpdate({viewerId : req.body.viewerId, video : req.body.video }
        , {}, {new: false, upsert : true}, (err, result) => {
        if (err) {
            console.log("err : ", err);
            return res.status(400).json({success: false, err});
        }
        })
});

module.exports = router;
