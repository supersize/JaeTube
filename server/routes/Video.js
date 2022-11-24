const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { setFfmpegPath } = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');
const { Record } = require('../models/Record');

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/")
    },
    filename : (req, file, callback) => {
        const originalFileName = file.originalname.split('.');
        callback(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype !== 'video/mp4') {
        return callback('only mp4 is allowed', false);            
    }
    callback(null, true)
}

const upload = multer({storage: storage, fileFilter : fileFilter }).single("file");

//=================================
//             Video
//=================================

// upload video
router.post("/uploadfiles", auth, (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err})
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
});

//create thumbnail.
router.post("/thumbnail", auth, (req, res) => {
    let filePath     = ""
    let fileDuration = ""
    console.log("ffmpeg : ", ffmpeg.ffprobe);
    console.log("req.body.url : ", req.body.url);
    
    // get information on video
    /*
    */
    ffmpeg.ffprobe(req.body.url, (err, metadata) => {
        console.dir(metadata);
        // console.log(metadata.format.duration);
        if (err) {
            console.log("ffprobe.ffprobe err : ", err);
        }
        
        console.log("metadata : ", metadata);

        fileDuration = metadata.format.duration
    })

    ffmpeg(req.body.url)
        .on("filenames", (filenames) => {
            // console.log('Will generate ' + filenames.json(', '));
            // console.log(filenames);

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on("end", () => {
            console.log('Screenshots taken');
            return res.json({success: true, url: filePath, fileDuration: fileDuration})
        })
        .on("error", (err) => {
            console.error(err);
            return res.json({success: true, err})
        })
        .screenshot({   
            count: 1,
            folder: 'uploads/thumbnails',
            size : '320x240',
            // %b: input basename(filename without extension)
            filename: 'thumbnail-%b.png'
        })

});

router.post('/uploadVideo', auth, (req, res) => {
    const video = new Video(req.body)
    video.save((err, doc) => {
        if(err) {
            return res.json({success: false, err})
        }

        res.status(200).json({ success: true })
    })
})

// router.get('/getVideos', auth, (req, res) => {
router.get('/getVideos', (req, res) => {
    // Video.find({privacy : 1})
    Video.find({
                $and: 
                    [
                        {privacy : 1}, 
                        {_id: {$ne: req.query.videoId}}
                    ]
                })
        .sort({views : -1})
        .limit(30)
        .populate('writer') // populate를 해줘야 writer의 정보를 가져온다. 없다면 그냥 id만 가져옴.
        .exec((err, videos) => {
            if(err) {
                return res.status(400).send(err);
            }
            
            return res.status(200).json({success: true, videos})
        })
    })

router.get('/search', (req, res) => {
    // I tired to find a way to search writer.name in popullated object but I coulnd't...
    console.log("req : ", req.query);
    Video.find({$text : {$search: req.query.keywords}})
        .sort({updatedAt : -1})
        .populate('writer') 
        .exec((err, videos) => {
            if(err) {
                return res.status(400).send(err);
            }
            console.log(videos);
            return res.status(200).json({success: true, videos})
        })
})

    /**
     * get my videos
     */
    router.post('/getMyVideos', (req, res) => {
        console.log("getMyvidoes : ", req.body);
        Video.find({writer : req.body.userId})
            .sort({updatedAt : -1})
            .populate('writer') // populate를 해줘야 writer의 정보를 가져온다. 없다면 그냥 id만 가져옴.
            .exec((err, videos) => {
                if(err) {
                    return res.status(400).send(err);
                }
                
                return res.status(200).json({success: true, videos})
            })
        })


/*  
*   Getting a video list that user is subscribing. 
*   @prarm : request(req), response(res)
*/
router.post('/getSubscriptionVideoList', auth, (req, res) => {
    // getting channel List
    Subscriber.find({userFrom : req.body.userFrom})
        .populate('userTo', {password: 0 })
        .exec((err, channels) => {
            if(err) {
                return res.status(400).send(err);
            }

            
            let channelList = [];
            channels.map((channel, index) => {
                channelList.push(channel.userTo._id);
            })

            if (channelList.length == 0) {
                return false;
            }

            // $in : this is a syntx when using list as param.
            Video.find({writer: {$in: channelList}, privacy: 1 })
                .exec((err, videos) => {
                    if(err) {
                        return res.status(400).send(err);
                    }

                    if(videos.length == 0) {
                        return false;
                    }

                    for (var channel of channels) {
                        channel.videos = [];
                        for (var video of videos) {
                            if (String(channel.userTo._id) == String(video.writer._id)) {
                                channel.videos.push(video);
                            }
                        }
                    }
                    return res.status(200).json({success: true, channels})
                })

        })
    })

/*  
*   Getting a video list that user's record. 
*   @prarm : request(req), response(res)
*/
router.post('/getRecordVideoList', auth, (req, res) => {
    // getting channel List
    Record.find({viewerId : req.body.userId})
        .sort({updatedAt : -1})
        .exec((err, records) => {
            if(err) {
                return res.status(400).send(err);
            }

            // console.log("recordList result : ", records);
            let recordList= []
            records.map((value, index) => {
                recordList.push(value.videoId)
            })
            console.log("videoList result : ", recordList);
            if (recordList.length == 0) {
                return false;
            }

            // $in : this is a syntx when using list as param.
            Video.find({_id: {$in: recordList}})
                .populate('writer')
                .exec((err, videoList) => {
                    if(err) {
                        return res.status(400).send(err);
                    }
                    
                    console.log("recordList : ", videoList);
                    return res.status(200).json({success: true, videoList})
                })
        })
    })

    // getting videos based on those chennels.
    // Video.find

router.post('/getVideo', (req, res) => {
    /**
     *  
     Video.findOne({"_id": req.body.videoId})
         .populate('writer') // populate를 해줘야 writer의 정보를 가져온다. 없다면 그냥 id만 가져옴.
         .exec((err, video) => {
             if(err) {
                 return res.status(400).send(err);
             }
 
             return res.status(200).json({success: true, video})
         })
    */

        //  Video.updateOne({_id : req.body.videoId}, {$inc: {views : 1}})
         Video.findByIdAndUpdate({_id : req.body.videoId}, {$inc: {views : 1}}, {new: true, upsert : false})
            .populate('writer')
            .exec((err, video) => {
                if(err) {
                    return res.status(400).send(err);
                }
    
                return res.status(200).json({success: true, video})
            })
    })

/*
* remove a video
*/
router.post('/remove', auth, (req, res) => {
    let targetVideoId = {_id : req.body._id};
    console.log('targetVideoId : ', targetVideoId);
    Video.findOneAndRemove(targetVideoId, (err, result) => {   
        if (err) return res.status(400).send(err)
        
        console.log('remove success : ', result);
        return res.status(200).json({success: true, result});
    })
})

module.exports = router;
