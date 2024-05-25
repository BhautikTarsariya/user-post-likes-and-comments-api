const LIKE = require('../models/LikesModel')
const USER = require('../models/UserModel')
var jwt = require('jsonwebtoken');

exports.like = async function (req, res, next) {
    try {
        // console.log("Check", req.body);
        let token = req.headers.authorization

        var decord = jwt.verify(token, "ABC");

        console.log("Check", decord);

        // let userId = req.body.likeBy

        var userFind = await LIKE.findOne({ likeBy: decord.id })
        if (userFind) {
            likeUpdate = await LIKE.findOne({ _id: userFind._id })
            likeUpdate.isLike = req.body.isLike
            likeUpdate.save()
        } else {
            likeUpdate = await LIKE({})
            likeUpdate.isLike = req.body.isLike
            likeUpdate.likeBy = decord.id
            likeUpdate.other_user = req.body.other_user
            likeUpdate.save()
        }


        // console.log("Check");
        res.status(200).json({
            message: "Like Added Successfully",
            data: []
        })
    } catch (err) {
        // console.log("Check",err);
        return res.status(404).json({
            status: "Fail",
            message: err.message
        })
    }
}