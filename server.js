var express = require("express");
var mongoose = require("mongoose");

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraperdb";

var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
