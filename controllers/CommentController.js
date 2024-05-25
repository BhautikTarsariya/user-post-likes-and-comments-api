const COMMENT = require('../models/CommentsModel')
var jwt = require('jsonwebtoken');

exports.comment = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        decord = jwt.verify(token, 'ABC')

        var findUser = await COMMENT({})
        findUser.comment = req.body.comment
        findUser.createBy = decord.id
        findUser.cmt_user = req.body.cmt_user
        findUser.save()
        
        res.status(200).json({
            message: "Comment Add",
            data: []
        })
    } catch (err) {
        return res.status(404).json({
            status: "Fail",
            message: err.message
        })
    }

}
