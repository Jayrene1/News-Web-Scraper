$(document).ready(function() {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
  var thisArticle = "";

  $.get("/articles", function(data) {
    populateArticles(data, commentEventListener);
  });

  function commentEventListener() {
    $(".collection-item").on("click", function(e) {
      e.preventDefault();
      thisArticle = this.dataset.articleid;
      commentFormListener();
      populateComments();
    });
  }

  function populateComments() {
    $.get(`/articles/${thisArticle}`, function(data) {
        $("#comment-section").empty();
        for (var i = 0; i < data.comments.length; i++) {
            var updatedAt = data.comments[i].updatedAt;
            var date = moment.utc(updatedAt).fromNow(); //utc converts mongo's default UTC format
          $("#comment-section").append(
            $("<div>")
              .attr("class", "comment")
              .append([
                $("<h5>").html(data.comments[i].author),
                $("<p>").html(data.comments[i].body),
                $("<p>").attr("class", "grey-text").html(date),
                $("<div>").attr("class", "divider")
              ])
          )
        }
        $(`[data-articleid=${thisArticle}] > span`).text(data.comments.length);
    });
  }

  function populateArticles(data, callback) {
    for (article of data) {
      var articleColumn = "";

      if (article.site === "Fox News") {
        articleColumn = ".articles-1";
      } else if (article.site === "NPR") {
        articleColumn = ".articles-2";
      }

      var updatedAt = article.updatedAt;
      var date = moment.utc(updatedAt).format("MM/DD/YYYY"); //utc converts mongo's default UTC format

      $(articleColumn).append([
        $("<img>").attr({ src: article.img, class: "responsive-img" }),
        $("<div>", { class: "section" }).append(
          $("<a>")
            .attr("href", article.link)
            .append($("<h5>").text(article.title))
        ),
        $("<div>")
          .attr("class", "collection left-align")
          .append(
            $("<a>")
              .attr({
                "data-target": "comment-box",
                "data-articleid": article._id,
                class: "collection-item modal-trigger"
              })
              .text(`${date} || See Comments`)
              .append(
                $("<span>")
                  .attr("class", "new badge")
                  .text(article.comments.length)
              )
          ),
        $("<div>", { class: "divider" })
      ]);
    }
    callback();
  }

  function commentFormListener() {
    $("form").on("submit", function(e) {
      e.preventDefault();
      data = {
        author: $("#author")
          .val()
          .trim(),
        body: $("#body")
          .val()
          .trim()
      };
      if (data.author && data.body) {
        $.post(`/articles/${thisArticle}`, data).then(function(data) {
          populateComments();
        });
      }
        $("#author").val("");
        $("#body").val("");
    });
  }
});
