const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.post("/getUserInfo", auth, (req, res) => {
    // "password : 0 " means you can get user info without password field
    User.findOne({ email : req.body.email },{"password" : 0}, (err, user) => {
        if (!user){
            return res.json({
                success: false,
                err,
                message: "User doesn't exist or not found."
            });
        }

        return res.status(200).json({success : true, user})
    });
});

router.post("/updateUserInfo", auth, (req, res) => {
    User.findOne({ email : req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "user is not found."
            });

            console.log("user : ", user );
            console.log("pw : ", req.body );
        user.comparePassword(req.body.currentPassword, (err, isMatch) => {
            if (!isMatch){
                return res.json({ loginSuccess: false, message: "Wrong password" });
            }
            
            User.findOneAndUpdate({ email : req.body.email }, req.body,
                    {new : true}, (err, user) => {
                if (!user){
                    return res.json({
                        success: false,
                        err,
                        message: "Fail to update user info"
                    });
                }
                return res.status(200).json({success : true})
            });
        });
    });
});

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email : req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
