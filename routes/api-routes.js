var db = require('../models');
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
        axios.get("https://www.foxnews.com/").then(function(response) {
            var $ = cheerio.load(response.data);

            $(".collection-spotlight").find(".article").each(function(i, element) {
                var $title = $(element).find(".info-header").find(".title").find("a");
                var $img = $(element).find("img").attr("src");
                if ($title.text()) {
                    var article = {};
                    article.title = $title.text();
                    article.link = $title.attr("href");
                    article.img = $img;
                    // Add Article to database if it doesn't exist yet
                    db.Article.findOneAndUpdate({title: article.title}, article, {upsert: true})
                        .then(function(dbArticle) {
                        //console.log(dbArticle);
                        })
                        .catch(function(err) {
                        console.log(err);
                        });
                }    
            });
            res.send("Articles scraped!");
        });
    });

    app.get("/articles", function(req, res) {
    db.Article.find({})
        .populate("comments")
        .then(function(dbArticle) {
        res.json(dbArticle);
        })
        .catch(function(err) {
        res.json(err);
        });
    });

    app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comments")
        .then(function(dbArticle) {
        res.json(dbArticle);
        })
        .catch(function(err) {
        res.json(err);
        });
    });

    app.get("/deleteall", function(req, res) {
        db.Article.find({}).deleteMany(function(dbArticle) {
            res.send("Articles deleted!");
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {comments: dbComment._id} }, { new: true });
        })
        .then(function(dbArticle) {
        res.json(dbArticle);
        })
        .catch(function(err) {
        res.json(err);
        });
    });
};
