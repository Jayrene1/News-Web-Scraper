var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, {timestamps: true});

// delete article after 5 days
CommentSchema.index({createdAt: 1}, {expireAfterSeconds: 432000});


var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
