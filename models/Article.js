var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  site: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: "No summary available..."
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

// delete article after 5 days
ArticleSchema.index({createdAt: 1}, {expireAfterSeconds: 432000});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
