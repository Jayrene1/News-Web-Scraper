var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, {timestamps: true});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
