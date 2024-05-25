const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    cmt_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    }
);

const COMMENT = mongoose.model('comment', CommentSchema);

module.exports = COMMENT;
