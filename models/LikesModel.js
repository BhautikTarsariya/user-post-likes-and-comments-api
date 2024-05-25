const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    isLike: {
        type: String,
        enum: ['Like', 'Dislike']
    },
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    other_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

},
    {
        timestamps: true
    }
);

const LIKE = mongoose.model('like', LikeSchema);

module.exports = LIKE;
