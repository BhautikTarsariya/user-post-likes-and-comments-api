var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController')
const LikeController = require('../controllers/LikeController')
const CommentController = require('../controllers/CommentController')
const USER = require('../models/UserModel')
var jwt = require('jsonwebtoken');


const secure = async function (req, res, next) {
  try {
    let token = req.headers.authorization

    if (!token) {
      throw new Error("Request Fail")
    }

    var decord = jwt.verify(token, "ABC");

    let checkUser = await USER.findById(decord.id)

    if (!checkUser) {
      throw new Error("Data Not Found")
    }

    req.body.id = decord.id

    next()

  } catch (err) {
    return res.status(404).json({
      status: "Fail",
      message: err.message
    })
  }
}

/* GET users listing. */
router.post('/user/signup', UserController.signup);
router.post('/user/signin', UserController.signin);
router.post('/user/userupdate', secure, UserController.userUpdate);

router.get('/user/get', UserController.likeUserGet);
router.get('/user/getcommentuser', UserController.cmtUserGet);


/* Likes */
router.post('/user/like', secure, LikeController.like);

/* Coments */
router.post('/user/comment', secure, CommentController.comment);



module.exports = router;
