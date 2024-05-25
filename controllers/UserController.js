const USER = require("../models/UserModel")
const LIKE = require("../models/LikesModel")
const COMMENT = require("../models/CommentsModel")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

exports.signup = async function (req, res, next) {
    try {
        console.log("Check", req.body);
        if (!req.body.name || !req.body.dateOfBirth || !req.body.gender || !req.body.email || !req.body.mobile || !req.body.password) {
            throw new Error("Please Complete Details")
        }

        if (req.body.password != req.body.confirmpassword) {
            throw new Error("Password And Confirm-Password are different")
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        let newUser = await USER.create(req.body)

        let token = jwt.sign({ id: newUser._id }, 'ABC')
        // console.log("Check");
        res.status(200).json({
            status: "Successfull",
            message: "Signup Successfull",
            data: newUser,
            token
        })
    } catch (err) {
        // console.log("Check",err);
        return res.status(404).json({
            status: "Signup Fail",
            message: err.message
        })
    }
}

exports.signin = async function (req, res, next) {
    try {
        if (!req.body.email) {
            throw new Error("Please Enter Email")
        }

        let userData = await USER.findOne({ email: req.body.email })
        // console.log("Check", userData);
        var password = req.body.password

        if (!userData) {
            throw new Error("Please Enter Vald Email")
        }

        // console.log("Check");

        checkPassword = await bcrypt.compare(password, userData.password)

        // console.log("Check", checkPassword);

        if (!checkPassword) {
            throw new Error("Incrrect Password")
        }

        let token = jwt.sign({ id: userData._id }, 'ABC')

        res.status(200).json({
            status: "Successfull",
            message: "Signin Successfull",
            // data: newUser,
            token
        })
    } catch (err) {
        return res.status(404).json({
            status: "Signin Fail",
            message: err.message
        })
    }
}

exports.likeUserGet = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        var decord = jwt.verify(token, "ABC");
        console.log("Check0", mongoose.Types.ObjectId(decord.id));
        let userData = await LIKE.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            // { $eq: ["$_id", "$$user_id"] },
                            { $eq: ["$isLike", "Like"] },
                            { $eq: ["$other_user", mongoose.Types.ObjectId(decord.id)] }
                        ]
                    }
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: 'likeBy',
                    foreignField: "_id",
                    as: "likeByuser"
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "like_count" }],
                    data: [
                        {
                            $project: {
                                isLike: 1,
                                other_user: 1,
                                likeByuser: 1
                            }
                        }
                    ]
                }
            }

        ]);
        res.status(200).json({
            message: "User Get Successfully",
            data: userData
        })
    } catch (err) {
        return res.status(404).json({
            status: "Fail",
            message: err.message
        })
    }
}

exports.cmtUserGet = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        var decord = jwt.verify(token, 'ABC')

        let userData = await COMMENT.aggregate([
            {   
                $lookup: {
                    from: "users",
                    let: { cmtt_user: "$cmt_user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$cmtt_user", mongoose.Types.ObjectId(decord.id)] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matches"
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'cmtByUser'
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "cmt_count" }],
                    data: [
                        {
                            $project: {
                                comment: 1,
                                cmt_user: 1,
                                cmtByUser: 1
                            }
                        }
                    ]
                }
            }
        ])

        res.status(200).json({
            message: "User Get Successfully",
            data: userData
        })

    } catch (err) {
        return res.status(404).json({
            status: 'Fail',
            message: err.message
        })
    }
}

exports.userUpdate = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        var decord = jwt.verify(token, 'ABC')

        var userUpdate = await USER.findOne({ _id: decord.id })
        userUpdate.name = req.body.name
        userUpdate.dateOfBirth = req.body.dateOfBirth
        userUpdate.gender = req.body.gender
        userUpdate.email = req.body.email
        userUpdate.mobile = req.body.mobile
        userUpdate.save()

        res.status(200).json({
            message: "Update Successfully",
            data: userUpdate
        })
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
}